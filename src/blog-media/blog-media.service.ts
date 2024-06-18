import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MediaService } from 'src/media/media.service';
import { Repository } from 'typeorm';
import { CreateBlogMediaDto } from './dto/create-blog-media.dto';
import { UpdateBlogMediaDto } from './dto/update-blog-media.dto';
import { BlogMedia } from './entities/blog-media.entity';

@Injectable()
export class BlogMediaService {
  constructor(
    @InjectRepository(BlogMedia)
    private readonly blogMediaRepository: Repository<BlogMedia>,
    private readonly mediaService: MediaService,
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

  async deleteByBlogIdAndMediaId(blogId: number, mediaId: number) {
    const blogMedia = await this.blogMediaRepository.findOne({
      where: { blog: { id: blogId }, media: { id: mediaId } },
      relations: { media: true },
    });
    if (!blogMedia) {
      throw new Error('BlogMedia relationship not found');
    }
    await this.mediaService.deleteMedia(blogMedia.media.cloudId, blogMedia.media.mediaType);
    await this.blogMediaRepository.remove(blogMedia);
    await this.mediaService.deleteById(mediaId);
  }
}
