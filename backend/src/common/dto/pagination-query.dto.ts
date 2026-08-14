import { Type } from "class-transformer";
import { IsInt, IsOptional, Max, Min } from "class-validator";

export class PaginationQueryDto {
  @IsInt()
  @IsOptional()
  @Max(100)
  @Min(1)
  @Type(() => Number)
  limit = 20;

  @IsInt()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  offset = 0;
}
