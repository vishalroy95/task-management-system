import { IsOptional, IsString, IsUUID, Length } from "class-validator";

export class CreateCommentDto {
  @IsOptional()
  @IsUUID()
  authorId?: string;

  @IsString()
  @Length(1, 4000)
  body!: string;

  @IsUUID()
  taskId!: string;
}
