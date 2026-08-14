import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Comment, CommentSchema } from "../comments/entities/comment.entity";
import { Label, LabelSchema } from "../labels/entities/label.entity";
import { Project, ProjectSchema } from "../projects/entities/project.entity";
import { Resource, ResourceSchema } from "../resources/entities/resource.entity";
import { Subtask, SubtaskSchema } from "../subtasks/entities/subtask.entity";
import { User, UserSchema } from "../users/entities/user.entity";
import { TasksController } from "./tasks.controller";
import { TaskUpdatesController } from "./task-updates.controller";
import { TaskUpdate, TaskUpdateSchema } from "./entities/task-update.entity";
import { Task, TaskSchema } from "./entities/task.entity";
import { TaskUpdatesService } from "./task-updates.service";
import { TasksService } from "./tasks.service";

@Module({
  controllers: [TasksController, TaskUpdatesController],
  exports: [TasksService],
  imports: [
    MongooseModule.forFeature([
      { name: Task.name, schema: TaskSchema },
      { name: TaskUpdate.name, schema: TaskUpdateSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: Label.name, schema: LabelSchema },
      { name: Project.name, schema: ProjectSchema },
      { name: Resource.name, schema: ResourceSchema },
      { name: Subtask.name, schema: SubtaskSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [TasksService, TaskUpdatesService],
})
export class TasksModule {}
