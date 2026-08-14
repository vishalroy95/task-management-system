import {
  IsArray,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from "class-validator";

import { TaskPriority, TaskStatus } from "../../../common/types/enums";

export class CreateTaskDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true })
  labelIds?: string[];

  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true })
  memberIds?: string[];

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @IsUUID()
  projectId!: string;

  @IsOptional()
  @IsUUID()
  reporterId?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsString()
  @Length(1, 180)
  title!: string;
}
