import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileInterceptor } from 'src/interceptor/media.interceptor';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files', 4, new FileInterceptor().createMulterOptions()))
  uploadFiles(@Req() req: any, @UploadedFiles() files: Express.Multer.File[]) {
    if (req.fileValidationError) {
      throw new HttpException(req.fileValidationError, HttpStatus.BAD_REQUEST);
    }
    if (!files) {
      throw new HttpException('File is require', HttpStatus.BAD_REQUEST);
    }
    return this.mediaService.uploadFileQueue(files,'dadasd');
  }
}
