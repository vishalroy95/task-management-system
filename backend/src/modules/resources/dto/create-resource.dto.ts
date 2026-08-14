import { IsString, IsUrl, IsUUID, Length } from "class-validator";

export class CreateResourceDto {
  @IsString()
  @Length(1, 160)
  name!: string;

  @IsUUID()
  taskId!: string;

  @IsString()
  @Length(1, 80)
  type!: string;

  @IsUrl()
  url!: string;
}
