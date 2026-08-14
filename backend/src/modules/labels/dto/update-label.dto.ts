import { IsHexColor, IsOptional, IsString, IsUUID, Length } from "class-validator";

export class UpdateLabelDto {
  @IsHexColor()
  @IsOptional()
  color?: string;

  @IsOptional()
  @IsString()
  @Length(1, 80)
  name?: string;

  @IsOptional()
  @IsUUID()
  workspaceId?: string;
}
