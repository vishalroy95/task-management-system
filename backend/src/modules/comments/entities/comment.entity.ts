import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { HydratedDocument } from "mongoose";

import { BaseEntity } from "../../../common/entities/base.entity";
import type { Task } from "../../tasks/entities/task.entity";
import type { User } from "../../users/entities/user.entity";

export type CommentDocument = HydratedDocument<Comment>;

@Schema({ collection: "comments", timestamps: true, versionKey: false })
export class Comment extends BaseEntity {
  @Prop({ required: true, type: String })
  body!: string;

  @Prop({ ref: "Task", type: String })
  task!: Task;

  @Prop({ required: true, type: String })
  taskId!: string;

  @Prop({ ref: "User", type: String })
  author?: User;

  @Prop({ type: String })
  authorId?: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

CommentSchema.index({ taskId: 1 });
