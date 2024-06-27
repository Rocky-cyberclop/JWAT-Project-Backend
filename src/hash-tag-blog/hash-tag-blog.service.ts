import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HashTagBlog } from './entities/hash-tag-blog.entity';

@Injectable()
export class HashTagBlogService {
  constructor(
    @InjectRepository(HashTagBlog)
    private readonly hashTagBlogRepository: Repository<HashTagBlog>,
  ) {}

  async save(hashTagBlog: HashTagBlog): Promise<HashTagBlog> {
    return await this.hashTagBlogRepository.save(hashTagBlog);
  }

  async deleteByBlogIdAndHashTagId(blogId: number, hashTagId: number) {
    const blogHashTag = await this.hashTagBlogRepository.findOne({
      where: { blog: { id: blogId }, hashTag: { id: hashTagId } },
    });
    if (blogHashTag) {
      await this.hashTagBlogRepository.remove(blogHashTag);
    }
  }
}
