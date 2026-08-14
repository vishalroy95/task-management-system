import { Prop } from "@nestjs/mongoose";
import { randomUUID } from "node:crypto";

export abstract class BaseEntity {
  @Prop({ default: () => randomUUID(), required: true, type: String, unique: true })
  id!: string;

  createdAt!: Date;

  updatedAt!: Date;
}
