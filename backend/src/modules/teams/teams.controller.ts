import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from "@nestjs/common";

import { CreateTeamDto } from "./dto/create-team.dto";
import { UpdateTeamDto } from "./dto/update-team.dto";
import { TeamsService } from "./teams.service";

@Controller("teams")
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  findAll() { return this.teamsService.findAll(); }

  @Get(":id")
  findOne(@Param("id") id: string) { return this.teamsService.findOne(id); }

  @Post()
  create(@Body() dto: CreateTeamDto) { return this.teamsService.create(dto); }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateTeamDto) { return this.teamsService.update(id, dto); }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id") id: string) { return this.teamsService.remove(id); }
}
