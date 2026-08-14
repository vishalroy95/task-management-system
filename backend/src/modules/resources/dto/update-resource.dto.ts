import { IsOptional, IsString, IsUrl, IsUUID, Length } from "class-validator";

export class UpdateResourceDto {
  @IsOptional()
  @IsString()
  @Length(1, 160)
  name?: string;

  @IsOptional()
  @IsUUID()
  taskId?: string;

  @IsOptional()
  @IsString()
  @Length(1, 80)
  type?: string;

  @IsOptional()
  @IsUrl()
  url?: string;
}
