import { IsOptional, IsString, Length } from "class-validator";

export class CreateWorkspaceDto {
  @IsOptional()
  @IsString()
  avatar?: string;

  @IsString()
  @Length(1, 120)
  name!: string;
}
