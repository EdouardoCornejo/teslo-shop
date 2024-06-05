import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

/**
 * UpdateProductDto is a data transfer object that is used to validate the incoming data
 * when updating an existing product.
 * It uses class-validator to validate the data.
 */
export class UpdateProductDto extends PartialType(CreateProductDto) {}
