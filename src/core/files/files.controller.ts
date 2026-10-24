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
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiProduces,
  ApiTags,
} from '@nestjs/swagger';
import { ErrorResponseDto } from 'src/common/dtos/error-response.dto';
import { FileUploadDto, FileUploadResponseDto } from './dto/file-upload.dto';

/**
 * Files controller
 */
@Controller('files')
@ApiTags('Files')
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
  @ApiOperation({
    summary: 'Upload a product image',
    description:
      'Uploads one image (jpg, jpeg, png or gif) in the `file` field. It is stored with a UUID name and the response contains its public URL.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileUploadDto })
  @ApiCreatedResponse({
    description: 'Image stored.',
    type: FileUploadResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'No file was sent or it is not a valid image.',
    type: ErrorResponseDto,
  })
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

  /**
   * Find product image
   * @param res Response
   * @param imageName Image name
   */
  @Get('product/:imageName')
  @ApiOperation({
    summary: 'Get a product image',
    description:
      'Streams a stored product image (seeded or uploaded) by its file name.',
  })
  @ApiParam({
    name: 'imageName',
    description: 'Image file name',
    example: '1740176-00-A_0_2000.jpg',
  })
  @ApiProduces('image/jpeg', 'image/png', 'image/gif')
  @ApiOkResponse({
    description: 'The image file.',
    schema: { type: 'string', format: 'binary' },
  })
  @ApiBadRequestResponse({
    description: 'No image with that name.',
    type: ErrorResponseDto,
  })
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
