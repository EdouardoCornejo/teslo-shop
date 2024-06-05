import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from 'src/core/products/entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';

/**
 * The ProductsService class is a service provider that is used to interact with the database.
 * It contains methods for creating, reading, updating, and deleting products.
 * The class uses the Product entity repository to interact with the database.
 */
@Injectable()
export class ProductsService {
  /**
   * The logger is used to log information about the ProductsService class.
   * It is used to log information about the service, such as errors and other messages.
   */
  private readonly logger = new Logger(ProductsService.name);

  /**
   * The constructor defines the ProductsService class.
   * It injects the Product entity repository, which is used to interact with the database.
   */
  //repository pattern
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  /**
   * The create method is used to create a new product.
   * It takes a CreateProductDto object as a parameter and returns the created product.
   * @param createProductDto The data transfer object that contains the data for creating a new product.
   * It is validated using the class-validator library.
   */
  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  /**
   * The findAll method is used to get all products from the database.
   * It does not take any parameters and returns an array of products.
   * The array may be empty if there are no products in the database.
   * The method calls the find method of the Product entity repository to get the products.
   * The method catches any errors that occur during the database operation and logs them.
   * If the error is a unique constraint violation, it throws a BadRequestException with the error message.
   */
  findAll(paginationDto: PaginationDto) {
    try {
      const { limit = 10, offset = 0 } = paginationDto;
      return this.productRepository.find({
        take: limit,
        skip: offset,
        //TODO: Relations
      });
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  /**
   * The findOne method is used to get a single product by its id.
   * It takes the id of the product as a parameter and returns the product.
   * If the product is not found, it returns an error.
   * The method calls the findOne method of the Product entity repository to get the product.
   * The method catches any errors that occur during the database operation and logs them.
   * If the error is a unique constraint violation, it throws a BadRequestException with the error message.
   * @param id The id of the product to find.
   * It is a string that represents the unique identifier of the product.
   */
  async findOne(term: string) {
    let product: Product;
    try {
      if (isUUID(term)) {
        product = await this.productRepository.findOneBy({ id: term });
      } else {
        const queryBuilder = this.productRepository.createQueryBuilder();
        product = await queryBuilder
          .where('UPPER(title) =:title or slug =:slug', {
            title: term.toUpperCase(),
            slug: term.toLowerCase(),
          })
          .getOne();
      }

      if (!product) {
        throw new Error('Product not found');
      }

      return product;
    } catch (error) {
      return error.message;
    }
  }

  /**
   * The update method is used to update an existing product.
   * It takes the id of the product and an UpdateProductDto object as parameters.
   * It returns the updated product.
   * If the product is not found, it returns an error.
   * The method calls the update method of the Product entity repository to update the product.
   * The method catches any errors that occur during the database operation and logs them.
   * If the error is a unique constraint violation, it throws a BadRequestException with the error message.
   * @param id The id of the product to update.
   * It is a string that represents the unique identifier of the product.
   */
  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      const product = await this.productRepository.preload({
        id: id,
        ...updateProductDto,
      });

      if (!product) {
        throw new NotFoundException(`Product with ${id} not found`);
      }

      return this.productRepository.save(product);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  /**
   * The remove method is used to delete an existing product.
   * It takes the id of the product as a parameter and returns the deleted product.
   * If the product is not found, it returns an error.
   * The method calls the delete method of the Product entity repository to delete the product.
   * The method catches any errors that occur during the database operation and logs them.
   */
  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  /**
   * The handleDBExceptions method is used to handle exceptions that occur during database operations.
   * It logs the error and throws an appropriate exception based on the error code.
   * If the error code is a unique constraint violation, it throws a BadRequestException with the error message.
   */
  private handleDBExceptions(error: any) {
    this.logger.error(error);

    if (error.code === '23505') throw new BadRequestException(error.detail);

    throw new InternalServerErrorException('Unexpected error occurred');
  }
}
