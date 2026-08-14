import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Subtask, SubtaskSchema } from "./entities/subtask.entity";
import { SubtasksController } from "./subtasks.controller";
import { SubtasksService } from "./subtasks.service";

@Module({
  controllers: [SubtasksController],
  imports: [MongooseModule.forFeature([{ name: Subtask.name, schema: SubtaskSchema }])],
  providers: [SubtasksService],
})
export class SubtasksModule {}
