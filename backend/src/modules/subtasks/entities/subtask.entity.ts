import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { HydratedDocument } from "mongoose";

import { BaseEntity } from "../../../common/entities/base.entity";
import { TaskPriority, TaskStatus } from "../../../common/types/enums";
import type { Task } from "../../tasks/entities/task.entity";

export type SubtaskDocument = HydratedDocument<Subtask>;

@Schema({ collection: "subtasks", timestamps: true, versionKey: false })
export class Subtask extends BaseEntity {
  @Prop({ required: true, type: String })
  title!: string;

  @Prop({ default: TaskStatus.Todo, enum: TaskStatus, type: String })
  status!: TaskStatus;

  @Prop({ default: TaskPriority.None, enum: TaskPriority, type: String })
  priority!: TaskPriority;

  @Prop({ type: String })
  dueDate?: string;

  @Prop({ ref: "Task", type: String })
  task!: Task;

  @Prop({ required: true, type: String })
  taskId!: string;
}

export const SubtaskSchema = SchemaFactory.createForClass(Subtask);

SubtaskSchema.index({ taskId: 1 });
