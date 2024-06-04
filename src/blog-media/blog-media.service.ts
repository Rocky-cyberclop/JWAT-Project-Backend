import { Injectable } from '@nestjs/common';
import { CreateBlogMediaDto } from './dto/create-blog-media.dto';
import { UpdateBlogMediaDto } from './dto/update-blog-media.dto';

@Injectable()
export class BlogMediaService {
  create(createBlogMediaDto: CreateBlogMediaDto) {
    return 'This action adds a new blogMedia';
  }

  findAll() {
    return `This action returns all blogMedia`;
  }

  findOne(id: number) {
    return `This action returns a #${id} blogMedia`;
  }

  update(id: number, updateBlogMediaDto: UpdateBlogMediaDto) {
    return `This action updates a #${id} blogMedia`;
  }

  remove(id: number) {
    return `This action removes a #${id} blogMedia`;
  }
}
