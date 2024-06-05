import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

/**
 * The ProductsController class is a controller that handles the HTTP requests related to products.
 * It defines the endpoints for creating, reading, updating, and deleting products.
 * The class uses the ProductsService class to handle the business logic.

 */
@Controller('products')
export class ProductsController {
  /**
   * The constructor defines the ProductsController class.
   * It injects the ProductsService class, which is used to handle the business logic.
   * @param productsService The service that handles the business logic for products.
   * It is injected into the ProductsController class.
   */
  constructor(private readonly productsService: ProductsService) {}

  /**
   * The create method is a POST endpoint that creates a new product.
   * It takes a CreateProductDto object as a parameter and returns the created product.
   * @param createProductDto The data transfer object that contains the data for creating a new product.
   * @returns The created product.
   */
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  /**
   * The findAll method is a GET endpoint that returns all products.
   * It does not take any parameters and returns an array of products.
   * @returns An array of products.
   */
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  /**
   * The findOne method is a GET endpoint that returns a single product by its id.
   * It takes the id of the product as a parameter and returns the product.
   * If the product is not found, it returns an error.
   * @param id The id of the product to find. It is a string that represents the unique identifier of the product.
   * @returns The product with the given id.
   */
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.findOne(id);
  }

  /**
   * The update method is a PATCH endpoint that updates an existing product.
   * It takes the id of the product and an UpdateProductDto object as parameters.
   * It returns the updated product.
   * If the product is not found, it returns an error.
   * @param id The id of the product to update. It is a string that represents the unique identifier of the product.
   * @param updateProductDto The data transfer object that contains the data for updating the product.
   * @returns The updated product.
   */
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  /**
   * The remove method is a DELETE endpoint that deletes an existing product.
   * It takes the id of the product as a parameter and returns the deleted product.
   * If the product is not found, it returns an error.
   * @param id The id of the product to delete. It is a string that represents the unique identifier of the product.
   * @returns The deleted product.
   */
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
