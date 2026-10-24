import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

/**
 * Data transfer object for creating a new user.
 */
export class CreateUserDto {
  /**
   * The email of the user.
   */
  @ApiProperty({
    example: 'jane.doe@gmail.com',
    description: 'Unique email of the user (stored in lowercase)',
    format: 'email',
  })
  @IsString()
  @IsEmail()
  email: string;

  /**
   * The password of the user.
   */
  @ApiProperty({
    example: 'Abc123456',
    description:
      'Password with at least one uppercase letter, one lowercase letter and a number',
    minLength: 6,
    maxLength: 50,
    format: 'password',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\w+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number.',
  })
  password: string;

  /**
   * The full name of the user.
   */
  @ApiProperty({
    example: 'Jane Doe',
    description: 'Full name of the user',
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  fullName: string;
}
