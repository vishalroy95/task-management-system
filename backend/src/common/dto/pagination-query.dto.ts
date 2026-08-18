import { Type } from "class-transformer";
import { IsNumber, IsOptional, Max, Min } from "class-validator";

export class PaginationQueryDto {
  @IsOptional()
  @Max(100)
  @Min(1)
  @IsNumber()
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @Min(0)
  @IsNumber()
  @Type(() => Number)
  offset?: number;
}
