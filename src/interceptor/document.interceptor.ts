import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class DocumentInterceptor {
  createMulterOptions(): MulterOptions {
    return {
      storage: diskStorage({
        destination: './uploads/documents',
        filename: (req, file, cb) => {
          const originalName = file.originalname;
          const fileExt = path.extname(originalName);
          const randomName = crypto.randomBytes(16).toString('hex');
          cb(null, `${randomName}${fileExt}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['presentation', 'msword', 'text/plain', 'sheet', 'pdf'];
        if (!allowedMimeTypes.some((type) => file.mimetype.includes(type))) {
          req.fileValidationError = `Wrong extension type. Accepted file ext are: ${allowedMimeTypes.join(', ')}`;
          return cb(new HttpException(req.fileValidationError, HttpStatus.BAD_REQUEST), false);
        }
        return cb(null, true);
      },
    };
  }
}
