import { Product } from 'src/core/products/entities/product.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Product image entity.
 */
@Entity({ name: 'product_images' })
export class ProductImage {
  /**
   * Unique identifier of the product image.
   * @type {number}
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * The product image URL.
   * @type {string}
   */
  @Column('text')
  url: string;

  /**
   * The product that the image belongs to.
   * @type {Product}
   */
  @ManyToOne(() => Product, (product) => product.images, {
    onDelete: 'CASCADE',
  })
  product: Product;
}
