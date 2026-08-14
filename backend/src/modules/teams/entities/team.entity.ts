import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { HydratedDocument } from "mongoose";

import { BaseEntity } from "../../../common/entities/base.entity";
import type { Project } from "../../projects/entities/project.entity";
import type { User } from "../../users/entities/user.entity";
import type { Workspace } from "../../workspaces/entities/workspace.entity";

export type TeamDocument = HydratedDocument<Team>;

@Schema({ collection: "teams", timestamps: true, versionKey: false })
export class Team extends BaseEntity {
  @Prop({ required: true, type: String })
  name!: string;

  @Prop({ ref: "Workspace", type: String })
  workspace!: Workspace;

  @Prop({ required: true, type: String })
  workspaceId!: string;

  @Prop({ default: [], ref: "User", type: [String] })
  members!: User[];

  @Prop({ default: [], ref: "Project", type: [String] })
  projects!: Project[];
}

export const TeamSchema = SchemaFactory.createForClass(Team);

TeamSchema.index({ workspaceId: 1 });
