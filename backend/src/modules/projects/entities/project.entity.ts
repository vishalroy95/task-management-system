import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { HydratedDocument } from "mongoose";

import { BaseEntity } from "../../../common/entities/base.entity";
import { ProjectStatus, TaskPriority } from "../../../common/types/enums";
import type { Task } from "../../tasks/entities/task.entity";
import type { Team } from "../../teams/entities/team.entity";
import type { User } from "../../users/entities/user.entity";
import type { Workspace } from "../../workspaces/entities/workspace.entity";

export type ProjectDocument = HydratedDocument<Project>;

@Schema({ collection: "projects", timestamps: true, versionKey: false })
export class Project extends BaseEntity {
  @Prop({ required: true, type: String })
  name!: string;

  @Prop({ type: String })
  description?: string;

  @Prop({ type: String })
  dueDate?: string;

  @Prop({ default: TaskPriority.None, enum: TaskPriority, type: String })
  priority!: TaskPriority;

  @Prop({ default: ProjectStatus.Planning, enum: ProjectStatus, type: String })
  status!: ProjectStatus;

  @Prop({ ref: "Workspace", type: String })
  workspace!: Workspace;

  @Prop({ required: true, type: String })
  workspaceId!: string;

  @Prop({ ref: "User", type: String })
  lead?: User;

  @Prop({ type: String })
  leadId?: string;

  @Prop({ ref: "Team", type: String })
  team?: Team;

  @Prop({ type: String })
  teamId?: string;

  @Prop({ default: [], ref: "Task", type: [String] })
  tasks!: Task[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);

ProjectSchema.index({ leadId: 1 });
ProjectSchema.index({ status: 1, priority: 1 });
ProjectSchema.index({ workspaceId: 1 });
