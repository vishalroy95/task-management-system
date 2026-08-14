import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { CommentsModule } from "./modules/comments/comments.module";
import { HealthModule } from "./modules/health/health.module";
import { LabelsModule } from "./modules/labels/labels.module";
import { ProjectsModule } from "./modules/projects/projects.module";
import { ResourcesModule } from "./modules/resources/resources.module";
import { SubtasksModule } from "./modules/subtasks/subtasks.module";
import { TasksModule } from "./modules/tasks/tasks.module";
import { TeamsModule } from "./modules/teams/teams.module";
import { UsersModule } from "./modules/users/users.module";
import { WorkspacesModule } from "./modules/workspaces/workspaces.module";
import { appConfig } from "./config/app.config";
import { databaseConfig } from "./config/database.config";
import { DatabaseModule } from "./database/database.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      envFilePath: [".env"],
      isGlobal: true,
      load: [appConfig, databaseConfig],
    }),
    DatabaseModule,
    CommentsModule,
    HealthModule,
    LabelsModule,
    ProjectsModule,
    ResourcesModule,
    SubtasksModule,
    TasksModule,
    TeamsModule,
    UsersModule,
    WorkspacesModule,
  ],
})
export class AppModule {}
