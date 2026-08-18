import {
  IsArray,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
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
  @IsString({ each: true })
  labelIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  memberIds?: string[];

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @IsString()
  projectId!: string;

  @IsOptional()
  @IsString()
  reporterId?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsString()
  @Length(1, 180)
  title!: string;
}
