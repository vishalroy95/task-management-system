import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Team, TeamSchema } from "./entities/team.entity";
import { TeamsController } from "./teams.controller";
import { TeamsService } from "./teams.service";

@Module({
  controllers: [TeamsController],
  imports: [MongooseModule.forFeature([{ name: Team.name, schema: TeamSchema }])],
  providers: [TeamsService],
})
export class TeamsModule {}
