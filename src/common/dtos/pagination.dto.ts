import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

/**
 * PaginationDto is a data transfer object that is used to validate the incoming data
 * when paginating a list of items.
 * It uses class-validator to ensure the data adheres to specific rules.
 */
export class PaginationDto {
  /**
   * The limit parameter is used to limit the number of items returned in a paginated list.
   * It should be a positive number.
   * This field is optional, as the default limit is set in the service.
   */
  @ApiPropertyOptional({
    default: 10,
    minimum: 1,
    type: Number,
    example: 10,
    description: 'How many rows do you need',
  })
  @IsOptional()
  @IsPositive()
  @Type(() => Number) //enableImplicitConversions: true
  limit?: number;

  /**
   * The offset parameter is used to skip a number of items in a paginated list.
   * It should be a non-negative number.
   * This field is optional, as the default offset is set in the service.
   */
  @ApiPropertyOptional({
    default: 0,
    minimum: 0,
    type: Number,
    example: 0,
    description: 'How many rows do you want to skip',
  })
  @IsOptional()
  @Min(0)
  @Type(() => Number) //enableImplicitConversions: true
  offset?: number;
}
