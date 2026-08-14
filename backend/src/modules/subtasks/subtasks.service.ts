import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import type { Model } from "mongoose";

import { CrudService } from "../../common/services/crud-service";
import { Subtask } from "./entities/subtask.entity";

@Injectable()
export class SubtasksService extends CrudService<Subtask> {
  constructor(
    @InjectModel(Subtask.name)
    subtasksRepository: Model<Subtask>,
  ) {
    super(subtasksRepository, "Subtask");
  }
}
