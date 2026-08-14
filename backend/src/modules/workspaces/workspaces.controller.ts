import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from "@nestjs/common";

import { CreateWorkspaceDto } from "./dto/create-workspace.dto";
import { UpdateWorkspaceDto } from "./dto/update-workspace.dto";
import { WorkspacesService } from "./workspaces.service";

@Controller("workspaces")
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Get()
  findAll() { return this.workspacesService.findAll(); }

  @Get(":id")
  findOne(@Param("id") id: string) { return this.workspacesService.findOne(id); }

  @Post()
  create(@Body() dto: CreateWorkspaceDto) { return this.workspacesService.create(dto); }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateWorkspaceDto) { return this.workspacesService.update(id, dto); }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id") id: string) { return this.workspacesService.remove(id); }
}
