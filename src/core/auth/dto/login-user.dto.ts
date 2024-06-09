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
  @IsString()
  @IsEmail()
  email: string;

  /**
   * The password of the user.
   */
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\w+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number.',
  })
  password: string;
}
