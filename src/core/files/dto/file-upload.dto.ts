import { ApiProperty } from '@nestjs/swagger';

/**
 * Multipart body of the product image upload.
 * Used only to document the endpoint in Swagger.
 */
export class FileUploadDto {
  /**
   * The image to upload.
   */
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Image file (jpg, jpeg, png or gif)',
  })
  file: Express.Multer.File;
}

/**
 * Response of the product image upload.
 */
export class FileUploadResponseDto {
  /**
   * Public URL of the stored image.
   */
  @ApiProperty({
    example:
      'http://localhost:3000/api/files/product/0b5b0e57-6e2e-4c0e-9d0f-5f3f2d1c8a71.jpeg',
    description: 'Public URL of the stored image',
  })
  secureUrl: string;
}
