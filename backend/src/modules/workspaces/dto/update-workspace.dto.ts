import { IsOptional, IsString, Length } from "class-validator";

export class UpdateWorkspaceDto {
  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  @Length(1, 120)
  name?: string;
}
