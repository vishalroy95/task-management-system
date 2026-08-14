import { IsDateString, IsEnum, IsOptional, IsString, IsUUID, Length } from "class-validator";

import { TaskPriority, TaskStatus } from "../../../common/types/enums";

export class CreateSubtaskDto {
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsUUID()
  taskId!: string;

  @IsString()
  @Length(1, 180)
  title!: string;
}
