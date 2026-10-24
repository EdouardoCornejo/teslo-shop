import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

/**
 * CreateProductDto is a data transfer object that is used to validate the incoming data
 * when creating a new product.
 * It uses class-validator to ensure the data adheres to specific rules.
 */
export class CreateProductDto {
  /**
   * The title of the product.
   * It should be a string with a minimum length of 1 character.
   * @example "Smartphone"
   */
  @ApiProperty({
    description: 'The title of the product (must be unique)',
    example: 'Teslo Hoodie',
    nullable: false,
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  title: string;

  /**
   * The price of the product.
   * It should be a positive number.
   * This field is optional, as the price can be set later.
   * @example 699.99
   */
  @ApiPropertyOptional({
    description: 'The price of the product (positive number, defaults to 0)',
    example: 75,
    exclusiveMinimum: true,
    minimum: 0,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  /**
   * The description of the product.
   * It should be a string.
   * This field is optional, as the description can be added later.
   * @example "A high-end smartphone with 128GB storage"
   */
  @ApiPropertyOptional({
    description: 'The description of the product',
    example: 'A warm unisex hoodie with the Teslo logo.',
  })
  @IsString()
  @IsOptional()
  description?: string;

  /**
   * The category slug of the product.
   * It should be a string with a minimum length of 1 character.
   * This field is optional, as the category can be added later.
   * @example "electronics"
   */
  @ApiPropertyOptional({
    description:
      'Unique URL-friendly identifier. Generated from the title when omitted (lowercase, spaces → `_`, apostrophes removed)',
    example: 'teslo_hoodie',
  })
  @IsString()
  @IsOptional()
  slug?: string;

  /**
   * The stock of the product.
   * It should be a positive integer.
   * This field is optional, as the stock can be added later.
   * If the stock is not provided, it is assumed to be 0.
   * @example 100
   */
  @ApiPropertyOptional({
    description: 'Units in stock (positive integer, defaults to 0)',
    example: 10,
    type: 'integer',
    minimum: 1,
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?: number;

  /**
   * The sizes available for the product.
   * It should be an array of strings.
   * Each string should represent a size (e.g., 'S', 'M', 'L').
   * @example ["S", "M", "L"]
   */
  @ApiProperty({
    description: 'Available sizes',
    example: ['S', 'M', 'L'],
    type: [String],
  })
  @IsString({ each: true })
  @IsArray()
  sizes: string[];

  /**
   * The tags associated with the product.
   * It should be an array of strings.
   * Each string should represent a tag (e.g., 'new', 'sale', 'featured').
   */
  @ApiPropertyOptional({
    description: 'Search tags',
    example: ['hoodie'],
    type: [String],
  })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  tags: string[];

  /**
   * The image file names of the product.
   * On update, sending this field replaces every existing image.
   */
  @ApiPropertyOptional({
    description:
      'Image file names (see POST /api/files/product). On update, replaces all the current images',
    example: ['1740250-00-A_0_2000.jpg'],
    type: [String],
  })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[];

  /**
   * The gender category for the product.
   * It should be one of the following values: 'men', 'women', 'kid', 'unisex'.
   * This ensures the product is categorized correctly.
   * @example "unisex"
   */
  @ApiProperty({
    description: 'Gender category of the product',
    enum: ['men', 'women', 'kid', 'unisex'],
    example: 'unisex',
  })
  @IsIn(['men', 'women', 'kid', 'unisex'])
  gender: string;
}
