import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import type { Model } from "mongoose";

import { CrudService } from "../../common/services/crud-service";
import { Label } from "./entities/label.entity";

@Injectable()
export class LabelsService extends CrudService<Label> {
  constructor(
    @InjectModel(Label.name)
    labelsRepository: Model<Label>,
  ) {
    super(labelsRepository, "Label");
  }
}
