import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
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
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * The email of the user.
   */
  @Column('text', {
    unique: true,
  })
  email: string;

  /**
   * The password of the user.
   */
  @Column('text', {
    select: false,
  })
  password: string;

  /**
   * The full name of the user.
   */
  @Column('text')
  fullName: string;

  /**
   * The flag that indicates if the user is active.
   */
  @Column('bool', {
    default: true,
  })
  isActive: boolean;

  /**
   * The roles of the user.
   */
  @Column('text', {
    array: true,
    default: ['user'],
  })
  roles: string[];

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
