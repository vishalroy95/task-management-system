import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { HydratedDocument } from "mongoose";

import { BaseEntity } from "../../../common/entities/base.entity";
import type { Task } from "../../tasks/entities/task.entity";

export type ResourceDocument = HydratedDocument<Resource>;

@Schema({ collection: "resources", timestamps: true, versionKey: false })
export class Resource extends BaseEntity {
  @Prop({ required: true, type: String })
  name!: string;

  @Prop({ required: true, type: String })
  type!: string;

  @Prop({ required: true, type: String })
  url!: string;

  @Prop({ ref: "Task", type: String })
  task!: Task;

  @Prop({ required: true, type: String })
  taskId!: string;
}

export const ResourceSchema = SchemaFactory.createForClass(Resource);

ResourceSchema.index({ taskId: 1 });
