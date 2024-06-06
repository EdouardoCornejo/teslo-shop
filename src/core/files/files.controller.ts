import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter, fileNamer } from '../../shared/helpers';
import { diskStorage } from 'multer';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

/**
 * Files controller
 */
@Controller('files')
export class FilesController {
  /**
   * Constructor
   * @param filesService Files service
   */
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Upload product image
   * @param file Uploaded file
   * @returns Uploaded file
   */
  @Post('product')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
      // limits: { fileSize: 1000 },
      storage: diskStorage({
        destination: './static/products',
        filename: fileNamer,
      }),
    }),
  )
  uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('make sure the uploaded file is an image');
    }
    const secureUrl = `${this.configService.get<string>('HOST_API')}/files/product/${file.filename}`;

    return {
      secureUrl,
    };
  }

  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string,
  ) {
    const path = this.filesService.getStaticProductImage(imageName);

    //custom response
    // res.status(403).json({
    //   status: true,
    //   path,
    // });

    //response file
    res.sendFile(path);
  }
}
