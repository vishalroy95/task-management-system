import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { HydratedDocument } from "mongoose";

import { BaseEntity } from "../../../common/entities/base.entity";
import type { Task } from "../../tasks/entities/task.entity";
import type { Workspace } from "../../workspaces/entities/workspace.entity";

export type LabelDocument = HydratedDocument<Label>;

@Schema({ collection: "labels", timestamps: true, versionKey: false })
export class Label extends BaseEntity {
  @Prop({ required: true, type: String })
  name!: string;

  @Prop({ default: "#64748b", type: String })
  color!: string;

  @Prop({ ref: "Workspace", type: String })
  workspace!: Workspace;

  @Prop({ required: true, type: String })
  workspaceId!: string;

  @Prop({ default: [], ref: "Task", type: [String] })
  tasks!: Task[];
}

export const LabelSchema = SchemaFactory.createForClass(Label);

LabelSchema.index({ workspaceId: 1 });
