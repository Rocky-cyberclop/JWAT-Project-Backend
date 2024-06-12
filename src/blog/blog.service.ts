import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { BlogMediaService } from 'src/blog-media/blog-media.service';
import { BlogMedia } from 'src/blog-media/entities/blog-media.entity';
import { Media } from 'src/media/entities/media.entity';
import { MediaService } from 'src/media/media.service';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog } from './entities/blog.entity';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
    private readonly userService: UserService,
    private readonly mediaService: MediaService,
    private readonly blogMediaService: BlogMediaService,
  ) {}

  async create(
    userId: number,
    createBlogDto: CreateBlogDto,
    files: Express.Multer.File[],
  ): Promise<boolean> {
    const user = await this.userService.findOne(userId);
    const blog = new Blog();
    blog.user = plainToClass(User, user);
    blog.title = createBlogDto.title;
    blog.content = createBlogDto.content;
    const saveBlog = await this.blogRepository.save(blog);
    if (files.length !== 0) {
      const medias = await this.attachMedia(files);
      medias.forEach(async (md) => {
        const media = new Media();
        media.url = md.url;
        media.cloudId = md.public_id;
        media.mediaType = md.resource_type;
        const saveMedia = await this.mediaService.save(media);
        const blogMedia = new BlogMedia();
        blogMedia.blog = saveBlog;
        blogMedia.media = saveMedia;
        await this.blogMediaService.save(blogMedia);
      });
    }
    return true;
  }

  async attachMedia(files: Express.Multer.File[]) {
    return await this.mediaService.uploadFileQueue(files);
  }

  async findAll(): Promise<Blog[]> {
    return await this.blogRepository.find({
      relations: {
        blogMedias: {
          media: true,
          blog: true,
        },
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} blog`;
  }

  update(id: number, updateBlogDto: UpdateBlogDto) {
    return `This action updates a #${id} blog`;
  }

  remove(id: number) {
    return `This action removes a #${id} blog`;
  }
}
