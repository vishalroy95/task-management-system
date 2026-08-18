import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import type { Model } from "mongoose";

import { Label } from "../labels/entities/label.entity";
import { Task } from "../tasks/entities/task.entity";
import { Team } from "../teams/entities/team.entity";
import { User } from "../users/entities/user.entity";
import { Workspace } from "../workspaces/entities/workspace.entity";
import { CreateProjectDto } from "./dto/create-project.dto";
import { ProjectQueryDto } from "./dto/project-query.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { Project } from "./entities/project.entity";

type TaskResponse = Omit<Task, "labels" | "members" | "reporter"> & {
  labels?: Label[];
  members?: User[];
  reporter?: User | null;
};

type ProjectResponse = Omit<Project, "lead" | "tasks" | "team" | "workspace"> & {
  lead?: User | null;
  tasks?: TaskResponse[];
  team?: Team | null;
  workspace?: Workspace | null;
};

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name)
    private readonly projectsRepository: Model<Project>,
    @InjectModel(User.name)
    private readonly usersRepository: Model<User>,
    @InjectModel(Team.name)
    private readonly teamsRepository: Model<Team>,
    @InjectModel(Workspace.name)
    private readonly workspacesRepository: Model<Workspace>,
    @InjectModel(Task.name)
    private readonly tasksRepository: Model<Task>,
    @InjectModel(Label.name)
    private readonly labelsRepository: Model<Label>,
  ) {}

  async findAll(query: ProjectQueryDto) {
    const filter: Record<string, unknown> = {};

    if (query.search) {
      filter.name = { $regex: escapeRegex(query.search), $options: "i" };
    }

    if (query.priority) {
      filter.priority = query.priority;
    }

    if (query.status) {
      filter.status = query.status;
    }

    if (query.workspaceId) {
      filter.workspaceId = query.workspaceId;
    }

    if (query.leadId) {
      filter.leadId = query.leadId;
    }

    const [data, total] = await Promise.all([
      this.projectsRepository
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(query.offset ?? 0)
        .limit(query.limit ?? 20)
        .exec(),
      this.projectsRepository.countDocuments(filter).exec(),
    ]);

    return { data: await this.hydrateProjects(data, { includeTasks: false }), total };
  }

  async findOne(id: string) {
    const project = await this.projectsRepository.findOne({ id }).exec();

    if (!project) {
      throw new NotFoundException("Project not found");
    }

    const [hydratedProject] = await this.hydrateProjects([project], { includeTasks: true });

    return hydratedProject;
  }

  async create(dto: CreateProjectDto) {
    const project = await this.projectsRepository.create(dto);
    const [hydratedProject] = await this.hydrateProjects([project], { includeTasks: false });

    return hydratedProject;
  }

  async update(id: string, dto: UpdateProjectDto) {
    const project = await this.projectsRepository
      .findOneAndUpdate({ id }, removeUndefined(dto), {
        new: true,
        runValidators: true,
      })
      .exec();

    if (!project) {
      throw new NotFoundException("Project not found");
    }

    const [hydratedProject] = await this.hydrateProjects([project], { includeTasks: true });

    return hydratedProject;
  }

  async remove(id: string) {
    const result = await this.projectsRepository.deleteOne({ id }).exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException("Project not found");
    }
  }

  private async hydrateProjects(
    projects: Project[],
    options: { includeTasks: boolean },
  ): Promise<ProjectResponse[]> {
    const projectRecords = projects.map((project) => toPlain<Project>(project));
    const leadIds = compact(projectRecords.map((project) => project.leadId));
    const teamIds = compact(projectRecords.map((project) => project.teamId));
    const workspaceIds = compact(projectRecords.map((project) => project.workspaceId));

    const [leads, teams, workspaces] = await Promise.all([
      this.findByIds(this.usersRepository, leadIds),
      this.findByIds(this.teamsRepository, teamIds),
      this.findByIds(this.workspacesRepository, workspaceIds),
    ]);

    const tasksByProjectId = options.includeTasks
      ? await this.findTasksByProjectIds(projectRecords.map((project) => project.id))
      : new Map<string, TaskResponse[]>();

    return projectRecords.map((project) => ({
      ...project,
      lead: project.leadId ? leads.get(project.leadId) ?? null : null,
      tasks: tasksByProjectId.get(project.id) ?? [],
      team: project.teamId ? teams.get(project.teamId) ?? null : null,
      workspace: workspaces.get(project.workspaceId) ?? null,
    }));
  }

  private async findTasksByProjectIds(projectIds: string[]) {
    const tasks = await this.tasksRepository
      .find({ projectId: { $in: projectIds } })
      .sort({ createdAt: -1 })
      .exec();
    const taskRecords = tasks.map((task) => toPlain<Task>(task));
    const memberIds = unique(taskRecords.flatMap((task) => getStringArray(task.members)));
    const labelIds = unique(taskRecords.flatMap((task) => getStringArray(task.labels)));
    const reporterIds = compact(taskRecords.map((task) => task.reporterId));
    const [members, labels, reporters] = await Promise.all([
      this.findByIds(this.usersRepository, memberIds),
      this.findByIds(this.labelsRepository, labelIds),
      this.findByIds(this.usersRepository, reporterIds),
    ]);
    const grouped = new Map<string, TaskResponse[]>();

    for (const task of taskRecords) {
      const hydratedTask: TaskResponse = {
        ...task,
        labels: getStringArray(task.labels)
          .map((id) => labels.get(id))
          .filter((label): label is Label => Boolean(label)),
        members: getStringArray(task.members)
          .map((id) => members.get(id))
          .filter((member): member is User => Boolean(member)),
        reporter: task.reporterId ? reporters.get(task.reporterId) ?? null : null,
      };
      const group = grouped.get(task.projectId) ?? [];
      group.push(hydratedTask);
      grouped.set(task.projectId, group);
    }

    return grouped;
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
