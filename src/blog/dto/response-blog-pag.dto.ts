import { IPaginationMeta } from 'nestjs-typeorm-paginate';
import { ResponseBlogDto } from './response-blog.dto';

export class ResponseBlogDtoPag {
  items: ResponseBlogDto[];
  meta: IPaginationMeta;
}
