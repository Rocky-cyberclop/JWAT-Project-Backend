import { Injectable } from '@nestjs/common';
import { CreateHashTagBlogDto } from './dto/create-hash-tag-blog.dto';
import { UpdateHashTagBlogDto } from './dto/update-hash-tag-blog.dto';

@Injectable()
export class HashTagBlogService {
  create(createHashTagBlogDto: CreateHashTagBlogDto) {
    return 'This action adds a new hashTagBlog';
  }

  findAll() {
    return `This action returns all hashTagBlog`;
  }

  findOne(id: number) {
    return `This action returns a #${id} hashTagBlog`;
  }

  update(id: number, updateHashTagBlogDto: UpdateHashTagBlogDto) {
    return `This action updates a #${id} hashTagBlog`;
  }

  remove(id: number) {
    return `This action removes a #${id} hashTagBlog`;
  }
}
