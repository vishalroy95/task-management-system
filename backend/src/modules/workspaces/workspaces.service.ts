import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import type { Model } from "mongoose";

import { CrudService } from "../../common/services/crud-service";
import { Workspace } from "./entities/workspace.entity";

@Injectable()
export class WorkspacesService extends CrudService<Workspace> {
  constructor(
    @InjectModel(Workspace.name)
    workspacesRepository: Model<Workspace>,
  ) {
    super(workspacesRepository, "Workspace");
  }
}
