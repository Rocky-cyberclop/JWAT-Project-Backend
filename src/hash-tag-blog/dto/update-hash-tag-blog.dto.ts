import { PartialType } from '@nestjs/mapped-types';
import { CreateHashTagBlogDto } from './create-hash-tag-blog.dto';

export class UpdateHashTagBlogDto extends PartialType(CreateHashTagBlogDto) {}
