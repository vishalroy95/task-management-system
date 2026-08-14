import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from "@nestjs/common";

import { CreateTaskUpdateDto } from "./dto/create-task-update.dto";
import { TaskUpdatesService } from "./task-updates.service";

@Controller("task-updates")
export class TaskUpdatesController {
  constructor(private readonly taskUpdatesService: TaskUpdatesService) {}

  @Get()
  findAll() { return this.taskUpdatesService.findAll(); }

  @Get(":id")
  findOne(@Param("id") id: string) { return this.taskUpdatesService.findOne(id); }

  @Post()
  create(@Body() dto: CreateTaskUpdateDto) { return this.taskUpdatesService.create(dto); }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id") id: string) { return this.taskUpdatesService.remove(id); }
}
