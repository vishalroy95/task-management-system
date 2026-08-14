import { IsString, IsUUID, Length } from "class-validator";

export class CreateTeamDto {
  @IsString()
  @Length(1, 120)
  name!: string;

  @IsUUID()
  workspaceId!: string;
}
