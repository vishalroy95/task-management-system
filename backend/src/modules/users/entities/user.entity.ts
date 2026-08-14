import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { HydratedDocument } from "mongoose";

import { BaseEntity } from "../../../common/entities/base.entity";
import type { Comment } from "../../comments/entities/comment.entity";
import type { Project } from "../../projects/entities/project.entity";
import type { TaskUpdate } from "../../tasks/entities/task-update.entity";
import type { Task } from "../../tasks/entities/task.entity";
import type { Team } from "../../teams/entities/team.entity";
import type { Workspace } from "../../workspaces/entities/workspace.entity";

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: "users", timestamps: true, versionKey: false })
export class User extends BaseEntity {
  @Prop({ required: true, trim: true, type: String, unique: true })
  email!: string;

  @Prop({ required: true, type: String })
  fullName!: string;

  @Prop({ type: String })
  title?: string;

  @Prop({ required: true, trim: true, type: String, unique: true })
  username!: string;

  @Prop({ default: [], ref: "Workspace", type: [String] })
  workspaces!: Workspace[];

  @Prop({ default: [], ref: "Team", type: [String] })
  teams!: Team[];

  @Prop({ default: [], ref: "Project", type: [String] })
  ledProjects!: Project[];

  @Prop({ default: [], ref: "Task", type: [String] })
  assignedTasks!: Task[];

  @Prop({ default: [], ref: "Task", type: [String] })
  reportedTasks!: Task[];

  @Prop({ default: [], ref: "Comment", type: [String] })
  comments!: Comment[];

  @Prop({ default: [], ref: "TaskUpdate", type: [String] })
  taskUpdates!: TaskUpdate[];
}

export const UserSchema = SchemaFactory.createForClass(User);
