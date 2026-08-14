import { IsEmail, IsOptional, IsString, Length } from "class-validator";

export class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @Length(1, 120)
  fullName!: string;

  @IsOptional()
  @IsString()
  @Length(1, 120)
  title?: string;

  @IsString()
  @Length(3, 40)
  username!: string;
}
