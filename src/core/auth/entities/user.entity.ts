import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * The email of the user.
   */
  @ApiProperty()
  @Column('text', {
    unique: true,
  })
  email: string;

  /**
   * The password of the user.
   */
  @ApiProperty()
  @Column('text', {
    select: false,
  })
  password: string;

  /**
   * The full name of the user.
   */
  @ApiProperty()
  @Column('text')
  fullName: string;

  /**
   * The flag that indicates if the user is active.
   */
  @ApiProperty()
  @Column('bool', {
    default: true,
  })
  isActive: boolean;

  /**
   * The roles of the user.
   */
  @ApiProperty()
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
