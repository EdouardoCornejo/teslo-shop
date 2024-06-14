import { Injectable } from '@nestjs/common';
import { ProductsService } from './../products/products.service';
import { initialData } from 'src/core/seed/data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/core/auth/entities/user.entity';
import { Repository } from 'typeorm';

/**
 * Service responsible for handling the seed operations.
 */
@Injectable()
export class SeedService {
  /**
   * Constructor of the SeedService.
   * @param productsService The service responsible for handling the products operations.
   */
  constructor(
    private readonly productsService: ProductsService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Run the seed.
   */
  async runSeed() {
    await this.deleteTables();

    const adminUser = await this.insertUsers();

    await this.insertNewProducts(adminUser);

    return 'SEED EXECUTED';
  }

  /**
   * Delete all the tables.
   * @returns True if the tables were deleted successfully.
   */
  private async deleteTables() {
    await this.productsService.deleteAllProducts();

    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }

  /**
   * Insert users.
   * @returns True if the users were inserted successfully.
   */
  private async insertUsers() {
    const seedUsers = initialData.users;

    const users: User[] = [];

    seedUsers.forEach((user) => {
      users.push(this.userRepository.create(user));
    });

    await this.userRepository.save(users);

    return users[1];
  }

  /**
   * Insert new products.
   * @returns True if the products were inserted successfully.
   */
  private async insertNewProducts(user: User) {
    await this.productsService.deleteAllProducts();

    const products = initialData.products;

    const insertPromises = [];

    products.forEach((product) => {
      insertPromises.push(this.productsService.create(product, user));
    });

    await Promise.all(insertPromises);

    return true;
  }
}
