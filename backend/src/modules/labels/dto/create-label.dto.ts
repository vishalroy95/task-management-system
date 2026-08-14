import { IsHexColor, IsOptional, IsString, IsUUID, Length } from "class-validator";

export class CreateLabelDto {
  @IsHexColor()
  @IsOptional()
  color?: string;

  @IsString()
  @Length(1, 80)
  name!: string;

  @IsUUID()
  workspaceId!: string;
}
