import { IsOptional, IsString, IsUUID, Length } from "class-validator";

export class UpdateCommentDto {
  @IsOptional()
  @IsUUID()
  authorId?: string;

  @IsOptional()
  @IsString()
  @Length(1, 4000)
  body?: string;

  @IsOptional()
  @IsUUID()
  taskId?: string;
}
