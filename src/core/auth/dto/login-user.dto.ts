import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

/**
 * Data transfer object for logging in a user.
 */
export class LoginUserDto {
  /**
   * The email of the user.
   */
  @ApiProperty({
    example: 'super-user@gmail.com',
    description: 'The email of the user.',
    format: 'email',
    required: true,
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
      'The password of the user (uppercase, lowercase letter and a number).',
    minLength: 6,
    maxLength: 50,
    format: 'password',
    required: true,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\w+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number.',
  })
  password: string;
}
