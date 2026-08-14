import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { HydratedDocument } from "mongoose";

import { BaseEntity } from "../../../common/entities/base.entity";
import type { User } from "../../users/entities/user.entity";
import type { Task } from "./task.entity";

export type TaskUpdateDocument = HydratedDocument<TaskUpdate>;

@Schema({ collection: "task_updates", timestamps: true, versionKey: false })
export class TaskUpdate extends BaseEntity {
  @Prop({ required: true, type: String })
  message!: string;

  @Prop({ ref: "Task", type: String })
  task!: Task;

  @Prop({ required: true, type: String })
  taskId!: string;

  @Prop({ ref: "User", type: String })
  author?: User;

  @Prop({ type: String })
  authorId?: string;
}

export const TaskUpdateSchema = SchemaFactory.createForClass(TaskUpdate);

TaskUpdateSchema.index({ taskId: 1 });
