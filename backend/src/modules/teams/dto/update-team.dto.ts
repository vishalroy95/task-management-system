import { IsOptional, IsString, IsUUID, Length } from "class-validator";

export class UpdateTeamDto {
  @IsOptional()
  @IsString()
  @Length(1, 120)
  name?: string;

  @IsOptional()
  @IsUUID()
  workspaceId?: string;
}
