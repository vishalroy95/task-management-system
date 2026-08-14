import { IsOptional, IsString, IsUUID, Length } from "class-validator";

export class CreateTaskUpdateDto {
  @IsOptional()
  @IsUUID()
  authorId?: string;

  @IsString()
  @Length(1, 1000)
  message!: string;

  @IsUUID()
  taskId!: string;
}
