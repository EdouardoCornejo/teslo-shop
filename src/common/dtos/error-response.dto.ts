import { ApiProperty } from '@nestjs/swagger';

/**
 * Shape of the error body returned by NestJS HTTP exceptions.
 * Used only to document error responses in Swagger.
 */
export class ErrorResponseDto {
  /**
   * The HTTP status code.
   */
  @ApiProperty({ example: 400, description: 'HTTP status code' })
  statusCode: number;

  /**
   * A message, or the list of validation messages.
   */
  @ApiProperty({
    oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
    example: ['email must be an email'],
    description: 'Error message, or one message per failed validation rule',
  })
  message: string | string[];

  /**
   * The HTTP status text.
   */
  @ApiProperty({ example: 'Bad Request', description: 'HTTP status text' })
  error: string;
}
