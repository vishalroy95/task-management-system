import { IsDateString, IsEnum, IsOptional, IsString, IsUUID } from "class-validator";

import { PaginationQueryDto } from "../../../common/dto/pagination-query.dto";
import { TaskPriority, TaskStatus } from "../../../common/types/enums";

export class TaskQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsUUID()
  labelId?: string;

  @IsOptional()
  @IsUUID()
  memberId?: string;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
