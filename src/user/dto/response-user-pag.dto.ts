import { IPaginationMeta } from 'nestjs-typeorm-paginate';
import { ResponseUserDto } from './response-user.dto';

export class ResponseUserDtoPag {
  items: ResponseUserDto[];
  meta: IPaginationMeta;
}
