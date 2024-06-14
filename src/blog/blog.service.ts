import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { BlogMediaService } from 'src/blog-media/blog-media.service';
import { BlogMedia } from 'src/blog-media/entities/blog-media.entity';
import { HashTagBlog } from 'src/hash-tag-blog/entities/hash-tag-blog.entity';
import { HashTagBlogService } from 'src/hash-tag-blog/hash-tag-blog.service';
import { HashTag } from 'src/hash-tag/entities/hash-tag.entity';
import { HashTagService } from 'src/hash-tag/hash-tag.service';
import { Media } from 'src/media/entities/media.entity';
import { MediaService } from 'src/media/media.service';
import { User } from 'src/user/entities/user.entity';
import { Role } from 'src/user/enums/roles.enum';
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
    private readonly hashTagService: HashTagService,
    private readonly hashTagBlogService: HashTagBlogService,
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
    if (createBlogDto.hashTags.length !== 0) {
      this.attachHashTag(createBlogDto.hashTags, saveBlog);
    }
    if (files.length !== 0) {
      this.attachMedia(files, saveBlog);
    }
    return true;
  }

  async attachMedia(files: Express.Multer.File[], blog: Blog) {
    const medias = await this.mediaService.uploadFileQueue(files);
    medias.forEach(async (md) => {
      const media = new Media();
      media.url = md.url;
      media.cloudId = md.public_id;
      media.mediaType = md.resource_type;
      const saveMedia = await this.mediaService.save(media);
      const blogMedia = new BlogMedia();
      blogMedia.blog = blog;
      blogMedia.media = saveMedia;
      await this.blogMediaService.save(blogMedia);
    });
  }

  async attachHashTag(arrayHashTag: string[], blog: Blog) {
    arrayHashTag.forEach(async (ht) => {
      const hashTagExist = await this.hashTagService.findByName(ht);
      const hashTagBlog = new HashTagBlog();
      if (hashTagExist) {
        hashTagBlog.blog = blog;
        hashTagBlog.hashTag = hashTagExist;
        await this.hashTagBlogService.save(hashTagBlog);
      } else {
        const hashTag = new HashTag();
        hashTag.hashTagName = ht;
        const saveHashTag = await this.hashTagService.save(hashTag);
        hashTagBlog.blog = blog;
        hashTagBlog.hashTag = saveHashTag;
        await this.hashTagBlogService.save(hashTagBlog);
      }
    });
  }

  async findAll(): Promise<Blog[]> {
    return await this.blogRepository.find({
      relations: {
        blogMedias: {
          media: true,
        },
      },
    });
  }

  findOne(id: number) {
    return this.blogRepository.findOne({
      where: { id },
      relations: {
        blogMedias: {
          media: true,
        },
      },
    });
  }

  async update(id: number, updateBlogDto: UpdateBlogDto, files: Express.Multer.File[], userId:number): Promise<boolean> {
    const user = await this.userService.findOne(userId);
    const blog = await this.blogRepository.findOneBy({ id });
    if (user.id !== blog.user.id) {
      throw new HttpException('Not the owner', HttpStatus.BAD_REQUEST);
    }
    if (updateBlogDto.title) {
      blog.title = updateBlogDto.title;
    }
    if (updateBlogDto.content) {
      blog.content = updateBlogDto.content;
    }
    const saveBlog = await this.blogRepository.save(blog);
    if (updateBlogDto.deleteHashTagIds || updateBlogDto.hashTags) {
      this.updateHashTag(updateBlogDto.deleteHashTagIds, updateBlogDto.hashTags, saveBlog);
    }

    if (updateBlogDto.deleteMediaIds || files.length !== 0) {
      this.updateMedia(updateBlogDto.deleteMediaIds, files, saveBlog);
    }
    return true;
  }

  async updateHashTag(deleteHashTagIds: number[], hashTags: string[], blog: Blog) {
    if (deleteHashTagIds) {
      deleteHashTagIds.forEach((ht) => {
        this.hashTagBlogService.deleteByBlogIdAndHashTagId(blog.id, ht);
      });
    }
    if (hashTags) {
      this.attachHashTag(hashTags, blog);
    }
  }

  async updateMedia(deleteMediaIds: number[], files: Express.Multer.File[], blog: Blog) {
    if (deleteMediaIds) {
      deleteMediaIds.forEach((md) => {
        this.blogMediaService.deleteByBlogIdAndMediaId(blog.id, md);
      });
    }
    if (files.length !== 0) {
      this.attachMedia(files, blog);
    }
  }

  async remove(id: number, userId: number): Promise<boolean> {
    const user = await this.userService.findOne(userId);
    const blog = await this.blogRepository.findOneBy({ id });
    if (user.role === Role.EMPLOYEE && user.id !== blog.user.id) {
      throw new HttpException('Not the owner', HttpStatus.BAD_REQUEST);
    }
    await this.blogRepository.softDelete(id);
    return true;
  }
}
