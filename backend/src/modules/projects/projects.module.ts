import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Label, LabelSchema } from "../labels/entities/label.entity";
import { Task, TaskSchema } from "../tasks/entities/task.entity";
import { Team, TeamSchema } from "../teams/entities/team.entity";
import { User, UserSchema } from "../users/entities/user.entity";
import { Workspace, WorkspaceSchema } from "../workspaces/entities/workspace.entity";
import { Project, ProjectSchema } from "./entities/project.entity";
import { ProjectsController } from "./projects.controller";
import { ProjectsService } from "./projects.service";

@Module({
  controllers: [ProjectsController],
  exports: [ProjectsService],
  imports: [
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
      { name: Label.name, schema: LabelSchema },
      { name: Task.name, schema: TaskSchema },
      { name: Team.name, schema: TeamSchema },
      { name: User.name, schema: UserSchema },
      { name: Workspace.name, schema: WorkspaceSchema },
    ]),
  ],
  providers: [ProjectsService],
})
export class ProjectsModule {}
