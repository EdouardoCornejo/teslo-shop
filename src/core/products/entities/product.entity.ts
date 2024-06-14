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
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * The title of the product.
   * It should be a string with a minimum length of 1 character.
   */
  @ApiProperty({
    example: 't-shirt',
    description: 'Product title',
    uniqueItems: true,
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
    example: 10.99,
    description: 'Product price',
    uniqueItems: true,
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
    example: 'This is a t-shirt',
    description: 'Product description',
    uniqueItems: true,
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
    example: 't_shirt',
    description: 'Product slug identifier',
    uniqueItems: true,
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
    example: 10,
    description: 'Product Stock',
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
    example: ['S', 'M', 'L'],
    description: 'Product sizes',
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
    example: 'women',
    description: 'Product gender',
  })
  @Column('text')
  gender: string;

  /**
   * The tags of the product.
   * It should be an array of strings.
   * Each string should represent a tag (e.g., 'new', 'sale', 'featured').
   */
  @ApiProperty()
  @Column('text', {
    array: true,
    default: [],
  })
  tags: string[];

  @ManyToOne(() => User, (user) => user.product, { eager: true })
  user: User;

  /**
   * The images of the product.
   * It should be an array of ProductImage entities.
   */
  @ApiProperty()
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
