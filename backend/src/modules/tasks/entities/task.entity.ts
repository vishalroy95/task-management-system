import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { HydratedDocument } from "mongoose";

import { BaseEntity } from "../../../common/entities/base.entity";
import { TaskPriority, TaskStatus } from "../../../common/types/enums";
import type { Comment } from "../../comments/entities/comment.entity";
import type { Label } from "../../labels/entities/label.entity";
import type { Project } from "../../projects/entities/project.entity";
import type { Resource } from "../../resources/entities/resource.entity";
import type { Subtask } from "../../subtasks/entities/subtask.entity";
import type { User } from "../../users/entities/user.entity";
import type { TaskUpdate } from "./task-update.entity";

export type TaskDocument = HydratedDocument<Task>;

@Schema({ collection: "tasks", timestamps: true, versionKey: false })
export class Task extends BaseEntity {
  @Prop({ required: true, type: String })
  title!: string;

  @Prop({ type: String })
  description?: string;

  @Prop({ default: TaskStatus.Todo, enum: TaskStatus, type: String })
  status!: TaskStatus;

  @Prop({ default: TaskPriority.None, enum: TaskPriority, type: String })
  priority!: TaskPriority;

  @Prop({ type: String })
  dueDate?: string;

  @Prop({ ref: "Project", type: String })
  project!: Project;

  @Prop({ required: true, type: String })
  projectId!: string;

  @Prop({ default: [], ref: "User", type: [String] })
  members!: User[];

  @Prop({ ref: "User", type: String })
  reporter?: User;

  @Prop({ type: String })
  reporterId?: string;

  @Prop({ default: [], ref: "Label", type: [String] })
  labels!: Label[];

  @Prop({ default: [], ref: "Subtask", type: [String] })
  subtasks!: Subtask[];

  @Prop({ default: [], ref: "Comment", type: [String] })
  comments!: Comment[];

  @Prop({ default: [], ref: "TaskUpdate", type: [String] })
  updates!: TaskUpdate[];

  @Prop({ default: [], ref: "Resource", type: [String] })
  resources!: Resource[];
}

export const TaskSchema = SchemaFactory.createForClass(Task);

TaskSchema.index({ dueDate: 1 });
TaskSchema.index({ projectId: 1 });
TaskSchema.index({ priority: 1 });
TaskSchema.index({ status: 1 });
