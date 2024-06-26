import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HashTag } from './entities/hash-tag.entity';

@Injectable()
export class HashTagService {
  constructor(
    @InjectRepository(HashTag)
    private readonly hashTagRepository: Repository<HashTag>,
  ) {}

  async save(hashTag: HashTag): Promise<HashTag> {
    return await this.hashTagRepository.save(hashTag);
  }

  async findByName(hashTagName: string): Promise<HashTag> {
    return this.hashTagRepository.findOneBy({ hashTagName });
  }

  async getHashTagByBlogId(blogId: number) {
    return this.hashTagRepository.find({
      where: {
        hashTagBlogs: {
          blog: {
            id: blogId,
          },
        },
      },
    });
  }
}
