import { IPaginationMeta } from 'nestjs-typeorm-paginate';
import { ResponseUserDto } from 'src/user/dto/response-user.dto';

export class UserNotInResponse {
  items: ResponseUserDto[];
  meta: IPaginationMeta;
}
