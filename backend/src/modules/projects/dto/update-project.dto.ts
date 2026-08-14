import { IsDateString, IsEnum, IsOptional, IsString, IsUUID, Length } from "class-validator";

import { ProjectStatus, TaskPriority } from "../../../common/types/enums";

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsUUID()
  leadId?: string;

  @IsOptional()
  @IsString()
  @Length(1, 160)
  name?: string;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;

  @IsOptional()
  @IsUUID()
  teamId?: string;

  @IsOptional()
  @IsUUID()
  workspaceId?: string;
}
