import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Label, LabelSchema } from "./entities/label.entity";
import { LabelsController } from "./labels.controller";
import { LabelsService } from "./labels.service";

@Module({
  controllers: [LabelsController],
  imports: [MongooseModule.forFeature([{ name: Label.name, schema: LabelSchema }])],
  providers: [LabelsService],
})
export class LabelsModule {}
