import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import type { Model } from "mongoose";

import { CrudService } from "../../common/services/crud-service";
import { Resource } from "./entities/resource.entity";

@Injectable()
export class ResourcesService extends CrudService<Resource> {
  constructor(
    @InjectModel(Resource.name)
    resourcesRepository: Model<Resource>,
  ) {
    super(resourcesRepository, "Resource");
  }
}
