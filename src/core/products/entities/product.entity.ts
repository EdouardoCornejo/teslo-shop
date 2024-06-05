import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

/**
 * Product Entity
 * @description Product entity to store product data
 */
@Entity()
export class Product {
  /*
   * The id of the product.
   * It is a unique identifier for the product.
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * The title of the product.
   * It should be a string with a minimum length of 1 character.
   */
  @Column('text', {
    unique: true,
  })
  title: string;

  /**
   * The price of the product.
   * It should be a positive number.
   * It is optional, as the price can be set later.
   */
  @Column('float', {
    default: 0,
  })
  price: number;

  /**
   * The description of the product.
   * It should be a string.
   * It is optional, as the description can be added later.
   */
  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  /*
   * The slug of the product.
   * It is a unique identifier for the product.
   */
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
  @Column('int', {
    default: 0,
  })
  stock: number;

  /**
   * The sizes of the product.
   * It should be an array of strings.
   * Each string should represent a size (e.g., 'S', 'M', 'L').
   */
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
  @Column('text')
  gender: string;

  /**
   * The tags of the product.
   * It should be an array of strings.
   * Each string should represent a tag (e.g., 'new', 'sale', 'featured').
   */
  @Column('text', {
    array: true,
    default: [],
  })
  tags: string[];

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
