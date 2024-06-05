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
  @IsString()
  @MinLength(1)
  title: string;

  /**
   * The price of the product.
   * It should be a positive number.
   * This field is optional, as the price can be set later.
   * @example 699.99
   */
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
  @IsString()
  @IsOptional()
  description?: string;

  /**
   * The category slug of the product.
   * It should be a string with a minimum length of 1 character.
   * This field is optional, as the category can be added later.
   * @example "electronics"
   */
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
  @IsString({ each: true })
  @IsArray()
  sizes: string[];

  /**
   * The tags associated with the product.
   * It should be an array of strings.
   * Each string should represent a tag (e.g., 'new', 'sale', 'featured').
   */
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  tags: string[];

  /**
   * The gender category for the product.
   * It should be one of the following values: 'men', 'women', 'kid', 'unisex'.
   * This ensures the product is categorized correctly.
   * @example "unisex"
   */
  @IsIn(['men', 'women', 'kid', 'unisex'])
  gender: string;
}
