import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from "@nestjs/common";

import { CreateSubtaskDto } from "./dto/create-subtask.dto";
import { UpdateSubtaskDto } from "./dto/update-subtask.dto";
import { SubtasksService } from "./subtasks.service";

@Controller("subtasks")
export class SubtasksController {
  constructor(private readonly subtasksService: SubtasksService) {}

  @Get()
  findAll() { return this.subtasksService.findAll(); }

  @Get(":id")
  findOne(@Param("id") id: string) { return this.subtasksService.findOne(id); }

  @Post()
  create(@Body() dto: CreateSubtaskDto) { return this.subtasksService.create(dto); }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateSubtaskDto) { return this.subtasksService.update(id, dto); }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id") id: string) { return this.subtasksService.remove(id); }
}
