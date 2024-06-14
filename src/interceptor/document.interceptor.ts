import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { Observable } from 'rxjs';

@Injectable()
export class DocumentInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    console.log(context.switchToHttp().getRequest());
    return next.handle();
  }
  // createMulterOptions(): MulterOptions {
  //   return {
  //     fileFilter: (req, file, cb) => {
  //       console.log(file);
  //       console.log(file.size);
  //       cb(null, false);
  //     },
  //   };
  // }
}
