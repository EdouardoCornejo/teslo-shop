import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/core/auth/entities/user.entity';
import { ProductImage } from 'src/core/products/entities/product-image.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

/**
 * Product Entity
 * @description Product entity to store product data
 */
@Entity({ name: 'products' })
export class Product {
  /*
   * The id of the product.
   * It is a unique identifier for the product.
   */
  @ApiProperty({
    example: 'a8134509-c862-44f4-8bda-52b9cc595518',
    description: 'The unique identifier of the product',
    format: 'uuid',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * The title of the product.
   * It should be a string with a minimum length of 1 character.
   */
  @ApiProperty({
    example: 'Men’s Chill Crew Neck Sweatshirt',
    description: 'Product title (unique)',
  })
  @Column('text', {
    unique: true,
  })
  title: string;

  /**
   * The price of the product.
   * It should be a positive number.
   * It is optional, as the price can be set later.
   */
  @ApiProperty({
    example: 75,
    description: 'Product price',
    default: 0,
  })
  @Column('float', {
    default: 0,
  })
  price: number;

  /**
   * The description of the product.
   * It should be a string.
   * It is optional, as the description can be added later.
   */
  @ApiProperty({
    example: 'Introducing the Tesla Chill Collection...',
    description: 'Product description',
    nullable: true,
  })
  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  /*
   * The slug of the product.
   * It is a unique identifier for the product.
   */
  @ApiProperty({
    example: 'mens_chill_crew_neck_sweatshirt',
    description:
      'Unique URL-friendly identifier, generated from the title when omitted',
  })
  @Column({
    type: 'text',
    unique: true,
  })
  slug: string;

  /**
   * The stock of the product.
   * It should be a positive integer.
   * It is optional, as the stock can be added later.
   */
  @ApiProperty({
    example: 7,
    description: 'Units in stock',
    default: 0,
  })
  @Column('int', {
    default: 0,
  })
  stock: number;

  /**
   * The sizes of the product.
   * It should be an array of strings.
   * Each string should represent a size (e.g., 'S', 'M', 'L').
   */
  @ApiProperty({
    example: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: 'Available sizes',
    type: [String],
  })
  @Column('text', {
    array: true,
    default: [],
  })
  sizes: string[];

  /**
   * The colors of the product.
   * It should be an array of strings.
   * Each string should represent a color (e.g., 'red', 'blue', 'green').
   */
  @ApiProperty({
    example: 'men',
    description: 'Product gender',
    enum: ['men', 'women', 'kid', 'unisex'],
  })
  @Column('text')
  gender: string;

  /**
   * The tags of the product.
   * It should be an array of strings.
   * Each string should represent a tag (e.g., 'new', 'sale', 'featured').
   */
  @ApiProperty({
    example: ['sweatshirt'],
    description: 'Search tags',
    type: [String],
  })
  @Column('text', {
    array: true,
    default: [],
  })
  tags: string[];

  /**
   * The user who created or last updated the product.
   */
  @ApiProperty({
    type: () => User,
    description: 'User who created or last updated the product',
  })
  @ManyToOne(() => User, (user) => user.product, { eager: true })
  user: User;

  /**
   * The images of the product.
   * It should be an array of ProductImage entities.
   */
  @ApiProperty({
    example: ['1740176-00-A_0_2000.jpg', '1740176-00-A_1.jpg'],
    description:
      'Image file names, served at /api/files/product/{imageName} (returned as plain strings)',
    type: [String],
  })
  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true,
  })
  images?: ProductImage[];

  /**
   * The colors of the product.
   * It should be an array of strings.
   * Each string should represent a color (e.g., 'red', 'blue', 'green').
   */
  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }

    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }

  /**
   *  The checkSlugUpdate method is a hook that is called before updating a product.
   * It checks if the slug is present and updates it if it is not.
   * It converts the slug to lowercase and replaces spaces and apostrophes with underscores.
   */
  @BeforeUpdate()
  checkSlugUpdate() {
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}
