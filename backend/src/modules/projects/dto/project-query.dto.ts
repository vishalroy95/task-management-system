import { IsEnum, IsOptional, IsString, IsUUID } from "class-validator";

import { PaginationQueryDto } from "../../../common/dto/pagination-query.dto";
import { ProjectStatus, TaskPriority } from "../../../common/types/enums";

export class ProjectQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsUUID()
  leadId?: string;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @IsOptional()
  @IsUUID()
  workspaceId?: string;
}
