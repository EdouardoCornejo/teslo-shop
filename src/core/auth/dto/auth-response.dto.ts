import { ApiProperty } from '@nestjs/swagger';

/**
 * Response of a successful login.
 * Used only to document the endpoint in Swagger.
 */
export class LoginResponseDto {
  /**
   * The email of the user.
   */
  @ApiProperty({ example: 'super-user@gmail.com' })
  email: string;

  /**
   * The signed JWT.
   */
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT to send as `Authorization: Bearer <token>`',
  })
  token: string;
}

/**
 * Response of register and auth-status: the user plus a fresh JWT.
 * Used only to document the endpoints in Swagger.
 */
export class AuthUserResponseDto {
  /**
   * The unique identifier of the user.
   */
  @ApiProperty({
    example: '3f6a1c1e-2b6f-4a8a-9f39-1b3c2f6d9a10',
    format: 'uuid',
  })
  id: string;

  /**
   * The email of the user.
   */
  @ApiProperty({ example: 'jane.doe@gmail.com' })
  email: string;

  /**
   * The full name of the user.
   */
  @ApiProperty({ example: 'Jane Doe' })
  fullName: string;

  /**
   * The flag that indicates if the user is active.
   */
  @ApiProperty({ example: true })
  isActive: boolean;

  /**
   * The roles of the user.
   */
  @ApiProperty({ example: ['user'], type: [String] })
  roles: string[];

  /**
   * The signed JWT.
   */
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT to send as `Authorization: Bearer <token>`',
  })
  token: string;
}
