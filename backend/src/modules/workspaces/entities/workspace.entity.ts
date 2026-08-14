import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { HydratedDocument } from "mongoose";

import { BaseEntity } from "../../../common/entities/base.entity";
import type { Project } from "../../projects/entities/project.entity";
import type { Team } from "../../teams/entities/team.entity";
import type { User } from "../../users/entities/user.entity";

export type WorkspaceDocument = HydratedDocument<Workspace>;

@Schema({ collection: "workspaces", timestamps: true, versionKey: false })
export class Workspace extends BaseEntity {
  @Prop({ required: true, type: String })
  name!: string;

  @Prop({ type: String })
  avatar?: string;

  @Prop({ default: [], ref: "User", type: [String] })
  users!: User[];

  @Prop({ default: [], ref: "Project", type: [String] })
  projects!: Project[];

  @Prop({ default: [], ref: "Team", type: [String] })
  teams!: Team[];
}

export const WorkspaceSchema = SchemaFactory.createForClass(Workspace);
