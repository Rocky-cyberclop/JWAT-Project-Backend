import { PartialType } from '@nestjs/mapped-types';
import { CreateBlogMediaDto } from './create-blog-media.dto';

export class UpdateBlogMediaDto extends PartialType(CreateBlogMediaDto) {}
