import { Injectable } from '@nestjs/common';
import { ProductsService } from './../products/products.service';
import { initialData } from 'src/core/seed/data/seed-data';

/**
 * Service responsible for handling the seed operations.
 */
@Injectable()
export class SeedService {
  /**
   * Constructor of the SeedService.
   * @param productsService The service responsible for handling the products operations.
   */
  constructor(private readonly productsService: ProductsService) {}

  /**
   * Run the seed.
   */
  async runSeed() {
    await this.insertNewProducts();

    return 'SEED EXECUTED';
  }

  /**
   * Insert new products.
   * @returns True if the products were inserted successfully.
   */
  private async insertNewProducts() {
    await this.productsService.deleteAllProducts();

    const products = initialData.products;

    const insertPromises = [];

    products.forEach((product) => {
      insertPromises.push(this.productsService.create(product));
    });

    await Promise.all(insertPromises);

    return true;
  }
}
