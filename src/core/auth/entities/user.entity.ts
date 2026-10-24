import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Product } from 'src/core/products/entities/product.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

/**
 * Entity that represents a user in the database.
 */
@Entity('users')
export class User {
  /**
   * The unique identifier of the user.
   */
  @ApiProperty({
    example: '3f6a1c1e-2b6f-4a8a-9f39-1b3c2f6d9a10',
    description: 'The unique identifier of the user',
    format: 'uuid',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * The email of the user.
   */
  @ApiProperty({
    example: 'super-user@gmail.com',
    description: 'Unique email of the user, stored in lowercase',
  })
  @Column('text', {
    unique: true,
  })
  email: string;

  /**
   * The password of the user.
   */
  @ApiHideProperty()
  @Column('text', {
    select: false,
  })
  password: string;

  /**
   * The full name of the user.
   */
  @ApiProperty({ example: 'Super User', description: 'Full name of the user' })
  @Column('text')
  fullName: string;

  /**
   * The flag that indicates if the user is active.
   */
  @ApiProperty({
    example: true,
    description: 'Inactive users are rejected by the JWT strategy',
  })
  @Column('bool', {
    default: true,
  })
  isActive: boolean;

  /**
   * The roles of the user.
   */
  @ApiProperty({
    example: ['user', 'super-user'],
    description: 'Roles of the user: user, admin, super-user',
    type: [String],
  })
  @Column('text', {
    array: true,
    default: ['user'],
  })
  roles: string[];

  @OneToMany(() => Product, (product) => product.user)
  product: Product[];

  /**
   * The email in lowercase when the user was created.
   */
  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLocaleLowerCase().trim();
  }

  /**
   * The email in lowercase when the user was updated.
   */
  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }
}
