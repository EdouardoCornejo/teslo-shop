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
    example: 'email@email.com',
    description: 'The email of the user.',
    required: true,
  })
  @IsString()
  @IsEmail()
  email: string;

  /**
   * The password of the user.
   */
  @ApiProperty({
    example: 'password123',
    description: 'The password of the user.',
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
