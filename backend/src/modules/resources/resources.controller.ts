import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from "@nestjs/common";

import { CreateResourceDto } from "./dto/create-resource.dto";
import { UpdateResourceDto } from "./dto/update-resource.dto";
import { ResourcesService } from "./resources.service";

@Controller("resources")
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Get()
  findAll() { return this.resourcesService.findAll(); }

  @Get(":id")
  findOne(@Param("id") id: string) { return this.resourcesService.findOne(id); }

  @Post()
  create(@Body() dto: CreateResourceDto) { return this.resourcesService.create(dto); }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateResourceDto) { return this.resourcesService.update(id, dto); }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id") id: string) { return this.resourcesService.remove(id); }
}
