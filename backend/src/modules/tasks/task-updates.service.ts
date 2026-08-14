import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import type { Model } from "mongoose";

import { CrudService } from "../../common/services/crud-service";
import { TaskUpdate } from "./entities/task-update.entity";

@Injectable()
export class TaskUpdatesService extends CrudService<TaskUpdate> {
  constructor(
    @InjectModel(TaskUpdate.name)
    updatesRepository: Model<TaskUpdate>,
  ) {
    super(updatesRepository, "Task update");
  }
}
