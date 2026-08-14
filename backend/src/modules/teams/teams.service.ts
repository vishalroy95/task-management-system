import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import type { Model } from "mongoose";

import { CrudService } from "../../common/services/crud-service";
import { Team } from "./entities/team.entity";

@Injectable()
export class TeamsService extends CrudService<Team> {
  constructor(
    @InjectModel(Team.name)
    teamsRepository: Model<Team>,
  ) {
    super(teamsRepository, "Team");
  }
}
