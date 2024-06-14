import { Injectable } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

@Injectable()
export class DocumentInterceptor {
  createMulterOptions(): MulterOptions {
    return {
      fileFilter: (req, file, cb) => {
        console.log(file);
        console.log(file.size);
        cb(null, false);
      },
    };
  }
}
