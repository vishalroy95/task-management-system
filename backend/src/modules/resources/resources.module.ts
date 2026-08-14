import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Resource, ResourceSchema } from "./entities/resource.entity";
import { ResourcesController } from "./resources.controller";
import { ResourcesService } from "./resources.service";

@Module({
  controllers: [ResourcesController],
  imports: [MongooseModule.forFeature([{ name: Resource.name, schema: ResourceSchema }])],
  providers: [ResourcesService],
})
export class ResourcesModule {}
