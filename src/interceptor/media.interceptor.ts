// file.interceptor.ts
import { Injectable } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { extname } from 'path';

@Injectable()
export class FileInterceptor {
  createMulterOptions(): MulterOptions {
    return {
      fileFilter: (req, file, cb) => {
        const totalFileSize = req.headers['content-length'];
        if (totalFileSize > 1024 * 1024 * 30) {
          req.fileValidationError = 'File size is to large. Accepted file size is less than 30MB';
          cb(null, false);
        }
        if (file.mimetype.startsWith('video/')) {
          if (file.size > 1024 * 1024 * 15) {
            req.fileValidationError = 'File size is to large. Accepted file size is less than 15MB';
            cb(null, false);
          } else {
            cb(null, true);
          }
        }
        if (file.mimetype.startsWith('image/')) {
          const ext = extname(file.originalname);
          const allowedExtArr = ['.jpg', '.png', '.jpeg'];
          if (!allowedExtArr.includes(ext)) {
            req.fileValidationError = `Wrong extension type. Accepted file ext are: ${allowedExtArr.toString()}`;
            cb(null, false);
          } else if (file.size > 1024 * 1024 * 4) {
            req.fileValidationError = 'File size is to large. Accepted file size is less than 4MB';
            cb(null, false);
          } else {
            cb(null, true);
          }
        }
      },
    };
  }
}
