// file.interceptor.ts
import { Injectable } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { extname } from 'path';

@Injectable()
export class FileInterceptor {
  createMulterOptions(): MulterOptions {
    return {
      fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('video/')) {
          cb(null, true);
          const fileSize = parseInt(req.headers['content-length']);
          if (fileSize > 1024 * 1024 * 15) {
            req.fileValidationError = 'File size is to large. Accepted file size is less than 15MB';
            cb(null, false);
          } else {
            cb(null, true);
          }
        } else {
          const ext = extname(file.originalname);
          const allowedExtArr = ['.jpg', '.png', '.jpeg'];
          if (!allowedExtArr.includes(ext)) {
            req.fileValidationError = `Wrong extension type. Accepted file ext are: ${allowedExtArr.toString()}`;
            cb(null, false);
          } else {
            const fileSize = parseInt(req.headers['content-length']);
            if (fileSize > 1024 * 1024 * 4) {
              req.fileValidationError =
                'File size is to large. Accepted file size is less than 4MB';
              cb(null, false);
            } else {
              cb(null, true);
            }
          }
        }
      },
    };
  }
}
