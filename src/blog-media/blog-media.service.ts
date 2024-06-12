import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBlogMediaDto } from './dto/create-blog-media.dto';
import { UpdateBlogMediaDto } from './dto/update-blog-media.dto';
import { BlogMedia } from './entities/blog-media.entity';

@Injectable()
export class BlogMediaService {
  constructor(
    @InjectRepository(BlogMedia)
    private readonly blogMediaRepository: Repository<BlogMedia>,
  ) {}

  create(createBlogMediaDto: CreateBlogMediaDto) {
    return 'This action adds a new blogMedia';
  }

  async findAll(): Promise<BlogMedia[]> {
    return await this.blogMediaRepository.find({
      relations: {
        media: true,
        blog: true,
      },
    });
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

  async save(blogMedia: BlogMedia): Promise<BlogMedia> {
    return await this.blogMediaRepository.save(blogMedia);
  }
}
