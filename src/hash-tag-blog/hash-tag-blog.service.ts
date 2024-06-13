import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHashTagBlogDto } from './dto/create-hash-tag-blog.dto';
import { UpdateHashTagBlogDto } from './dto/update-hash-tag-blog.dto';
import { HashTagBlog } from './entities/hash-tag-blog.entity';

@Injectable()
export class HashTagBlogService {
  constructor(
    @InjectRepository(HashTagBlog)
    private readonly hashTagBlogRepository: Repository<HashTagBlog>,
  ) {}

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

  async save(hashTagBlog: HashTagBlog): Promise<HashTagBlog> {
    return await this.hashTagBlogRepository.save(hashTagBlog);
  }
}
