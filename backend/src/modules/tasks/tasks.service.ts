import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import type { Model } from "mongoose";

import { Comment } from "../comments/entities/comment.entity";
import { Label } from "../labels/entities/label.entity";
import { Project } from "../projects/entities/project.entity";
import { Resource } from "../resources/entities/resource.entity";
import { Subtask } from "../subtasks/entities/subtask.entity";
import { User } from "../users/entities/user.entity";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskQueryDto } from "./dto/task-query.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { TaskUpdate } from "./entities/task-update.entity";
import { Task } from "./entities/task.entity";

type TaskResponse = Omit<
  Task,
  "comments" | "labels" | "members" | "project" | "reporter" | "resources" | "subtasks" | "updates"
> & {
  comments?: Comment[];
  labels?: Label[];
  members?: User[];
  project?: Project | null;
  reporter?: User | null;
  resources?: Resource[];
  subtasks?: Subtask[];
  updates?: TaskUpdate[];
};

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name)
    private readonly tasksRepository: Model<Task>,
    @InjectModel(Project.name)
    private readonly projectsRepository: Model<Project>,
    @InjectModel(User.name)
    private readonly usersRepository: Model<User>,
    @InjectModel(Label.name)
    private readonly labelsRepository: Model<Label>,
    @InjectModel(Subtask.name)
    private readonly subtasksRepository: Model<Subtask>,
    @InjectModel(Comment.name)
    private readonly commentsRepository: Model<Comment>,
    @InjectModel(TaskUpdate.name)
    private readonly taskUpdatesRepository: Model<TaskUpdate>,
    @InjectModel(Resource.name)
    private readonly resourcesRepository: Model<Resource>,
  ) {}

  async findAll(query: TaskQueryDto) {
    const filter: Record<string, unknown> = {};

    if (query.search) {
      filter.title = { $regex: escapeRegex(query.search), $options: "i" };
    }

    if (query.status) {
      filter.status = query.status;
    }

    if (query.priority) {
      filter.priority = query.priority;
    }

    if (query.projectId) {
      filter.projectId = query.projectId;
    }

    if (query.memberId) {
      filter.members = query.memberId;
    }

    if (query.labelId) {
      filter.labels = query.labelId;
    }

    if (query.dueDate) {
      filter.dueDate = query.dueDate;
    }

    const [data, total] = await Promise.all([
      this.tasksRepository
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(query.offset)
        .limit(query.limit)
        .exec(),
      this.tasksRepository.countDocuments(filter).exec(),
    ]);

    return { data: await this.hydrateTasks(data, { includeChildren: false }), total };
  }

  async findOne(id: string) {
    const task = await this.tasksRepository.findOne({ id }).exec();

    if (!task) {
      throw new NotFoundException("Task not found");
    }

    const [hydratedTask] = await this.hydrateTasks([task], { includeChildren: true });

    return hydratedTask;
  }

  async create(dto: CreateTaskDto) {
    const task = {
      description: dto.description,
      dueDate: dto.dueDate,
      labels: dto.labelIds,
      members: dto.memberIds,
      priority: dto.priority,
      projectId: dto.projectId,
      reporterId: dto.reporterId,
      status: dto.status,
      title: dto.title,
    } as unknown as Partial<Task>;

    const createdTask = await this.tasksRepository.create(task);
    const [hydratedTask] = await this.hydrateTasks([createdTask], {
      includeChildren: false,
    });

    return hydratedTask;
  }

  async update(id: string, dto: UpdateTaskDto) {
    const update: Partial<Task> = {
      description: dto.description,
      dueDate: dto.dueDate,
      priority: dto.priority,
      projectId: dto.projectId,
      reporterId: dto.reporterId,
      status: dto.status,
      title: dto.title,
    };

    if (dto.memberIds) {
      update.members = dto.memberIds as unknown as Task["members"];
    }

    if (dto.labelIds) {
      update.labels = dto.labelIds as unknown as Task["labels"];
    }

    const task = await this.tasksRepository
      .findOneAndUpdate({ id }, removeUndefined(update), {
        new: true,
        runValidators: true,
      })
      .exec();

    if (!task) {
      throw new NotFoundException("Task not found");
    }

    const [hydratedTask] = await this.hydrateTasks([task], { includeChildren: true });

    return hydratedTask;
  }

  async remove(id: string) {
    const result = await this.tasksRepository.deleteOne({ id }).exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException("Task not found");
    }
  }

  private async hydrateTasks(
    tasks: Task[],
    options: { includeChildren: boolean },
  ): Promise<TaskResponse[]> {
    const taskRecords = tasks.map((task) => toPlain<Task>(task));
    const projectIds = compact(taskRecords.map((task) => task.projectId));
    const reporterIds = compact(taskRecords.map((task) => task.reporterId));
    const memberIds = unique(taskRecords.flatMap((task) => getStringArray(task.members)));
    const labelIds = unique(taskRecords.flatMap((task) => getStringArray(task.labels)));

    const [projects, reporters, members, labels] = await Promise.all([
      this.findByIds(this.projectsRepository, projectIds),
      this.findByIds(this.usersRepository, reporterIds),
      this.findByIds(this.usersRepository, memberIds),
      this.findByIds(this.labelsRepository, labelIds),
    ]);

    const childRelations = options.includeChildren
      ? await this.findChildRelations(taskRecords.map((task) => task.id))
      : {
          comments: new Map<string, Comment[]>(),
          resources: new Map<string, Resource[]>(),
          subtasks: new Map<string, Subtask[]>(),
          updates: new Map<string, TaskUpdate[]>(),
        };

    return taskRecords.map((task) => ({
      ...task,
      comments: childRelations.comments.get(task.id) ?? [],
      labels: getStringArray(task.labels)
        .map((id) => labels.get(id))
        .filter((label): label is Label => Boolean(label)),
      members: getStringArray(task.members)
        .map((id) => members.get(id))
        .filter((member): member is User => Boolean(member)),
      project: projects.get(task.projectId) ?? null,
      reporter: task.reporterId ? reporters.get(task.reporterId) ?? null : null,
      resources: childRelations.resources.get(task.id) ?? [],
      subtasks: childRelations.subtasks.get(task.id) ?? [],
      updates: childRelations.updates.get(task.id) ?? [],
    }));
  }

  private async findChildRelations(taskIds: string[]) {
    const [comments, resources, subtasks, updates] = await Promise.all([
      this.commentsRepository.find({ taskId: { $in: taskIds } }).sort({ createdAt: 1 }).exec(),
      this.resourcesRepository.find({ taskId: { $in: taskIds } }).sort({ createdAt: 1 }).exec(),
      this.subtasksRepository.find({ taskId: { $in: taskIds } }).sort({ createdAt: 1 }).exec(),
      this.taskUpdatesRepository.find({ taskId: { $in: taskIds } }).sort({ createdAt: 1 }).exec(),
    ]);

    return {
      comments: groupByTaskId(comments),
      resources: groupByTaskId(resources),
      subtasks: groupByTaskId(subtasks),
      updates: groupByTaskId(updates),
    };
  }

  private async findByIds<TEntity extends { id: string }>(
    model: Model<TEntity>,
    ids: string[],
  ): Promise<Map<string, TEntity>> {
    if (ids.length === 0) {
      return new Map();
    }

    const records = await model.find({ id: { $in: unique(ids) } }).exec();

    return new Map(records.map((record) => {
      const plainRecord = toPlain<TEntity>(record);

      return [plainRecord.id, plainRecord];
    }));
  }
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function compact(values: Array<string | undefined>) {
  return values.filter((value): value is string => Boolean(value));
}

function unique(values: string[]) {
  return [...new Set(values)];
}

function getStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item === "string") {
        return item;
      }

      if (hasStringId(item)) {
        return item.id;
      }

      return undefined;
    })
    .filter((item): item is string => Boolean(item));
}

function groupByTaskId<TEntity extends { taskId: string }>(records: TEntity[]) {
  const grouped = new Map<string, TEntity[]>();

  for (const record of records) {
    const plainRecord = toPlain<TEntity>(record);
    const group = grouped.get(plainRecord.taskId) ?? [];
    group.push(plainRecord);
    grouped.set(plainRecord.taskId, group);
  }

  return grouped;
}

function hasStringId(value: unknown): value is { id: string } {
  return (
    value !== null &&
    typeof value === "object" &&
    "id" in value &&
    typeof (value as { id?: unknown }).id === "string"
  );
}

function toPlain<TEntity>(record: TEntity): TEntity {
  if (record && typeof record === "object" && "toObject" in record) {
    return (record as { toObject: () => TEntity }).toObject();
  }

  return record;
}

function removeUndefined<TDto extends object>(dto: TDto) {
  return Object.fromEntries(
    Object.entries(dto).filter(([, value]) => value !== undefined),
  ) as Partial<TDto>;
}
