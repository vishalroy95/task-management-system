import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from "@nestjs/common";

import { CreateLabelDto } from "./dto/create-label.dto";
import { UpdateLabelDto } from "./dto/update-label.dto";
import { LabelsService } from "./labels.service";

@Controller("labels")
export class LabelsController {
  constructor(private readonly labelsService: LabelsService) {}

  @Get()
  findAll() { return this.labelsService.findAll(); }

  @Get(":id")
  findOne(@Param("id") id: string) { return this.labelsService.findOne(id); }

  @Post()
  create(@Body() dto: CreateLabelDto) { return this.labelsService.create(dto); }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateLabelDto) { return this.labelsService.update(id, dto); }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id") id: string) { return this.labelsService.remove(id); }
}
