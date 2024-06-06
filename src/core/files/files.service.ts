import { join } from 'path';
import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';

/**
 * Files service
 */
@Injectable()
export class FilesService {
  /**
   * Get static product image
   * @param imageName Image name
   * @returns Image path
   */
  getStaticProductImage(imageName: string) {
    const path = join(__dirname, '../../../static/products', imageName);

    if (!existsSync(path)) {
      throw new BadRequestException(`Image ${imageName} not found`);
    }

    return path;
  }
}
