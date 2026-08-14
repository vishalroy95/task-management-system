import { IsEmail, IsOptional, IsString, Length } from "class-validator";

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsOptional()
  @IsString()
  @Length(1, 120)
  fullName?: string;

  @IsOptional()
  @IsString()
  @Length(1, 120)
  title?: string;

  @IsOptional()
  @IsString()
  @Length(3, 40)
  username?: string;
}
