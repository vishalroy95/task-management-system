import { IsDateString, IsEnum, IsOptional, IsString } from "class-validator";

import { PaginationQueryDto } from "../../../common/dto/pagination-query.dto";
import { TaskPriority, TaskStatus } from "../../../common/types/enums";

export class TaskQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsString()
  labelId?: string;

  @IsOptional()
  @IsString()
  memberId?: string;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @IsOptional()
  @IsString()
  projectId?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
