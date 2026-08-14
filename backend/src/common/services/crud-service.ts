import { NotFoundException } from "@nestjs/common";
import type { Model } from "mongoose";

export abstract class CrudService<TEntity extends { id: string }> {
  protected constructor(
    private readonly model: Model<TEntity>,
    private readonly entityName: string,
  ) {}

  findAll() {
    return this.model.find().exec();
  }

  async findOne(id: string) {
    const entity = await this.model.findOne({ id }).exec();

    if (!entity) {
      throw new NotFoundException(`${this.entityName} not found`);
    }

    return entity;
  }

  create<TDto extends Partial<TEntity>>(dto: TDto) {
    return this.model.create(dto);
  }

  async update<TDto extends Partial<TEntity>>(id: string, dto: TDto) {
    const entity = await this.model
      .findOneAndUpdate({ id }, removeUndefined(dto), {
        new: true,
        runValidators: true,
      })
      .exec();

    if (!entity) {
      throw new NotFoundException(`${this.entityName} not found`);
    }

    return entity;
  }

  async remove(id: string) {
    const result = await this.model.deleteOne({ id }).exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException(`${this.entityName} not found`);
    }
  }
}

function removeUndefined<TDto extends object>(dto: TDto) {
  return Object.fromEntries(
    Object.entries(dto).filter(([, value]) => value !== undefined),
  ) as Partial<TDto>;
}
