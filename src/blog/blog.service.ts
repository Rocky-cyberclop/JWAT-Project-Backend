import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  LoggerService,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { BlogMediaService } from 'src/blog-media/blog-media.service';
import { BlogMedia } from 'src/blog-media/entities/blog-media.entity';
import { CommentService } from 'src/comment/comment.service';
import { Comment } from 'src/comment/entities/comment.entity';
import { HashTagBlog } from 'src/hash-tag-blog/entities/hash-tag-blog.entity';
import { HashTagBlogService } from 'src/hash-tag-blog/hash-tag-blog.service';
import { HashTag } from 'src/hash-tag/entities/hash-tag.entity';
import { HashTagService } from 'src/hash-tag/hash-tag.service';
import { Media } from 'src/media/entities/media.entity';
import { MediaService } from 'src/media/media.service';
import { SocketService } from 'src/socket/socket.service';
import { StarDetail } from 'src/star-detail/entities/star-detail.entity';
import { StarDetailService } from 'src/star-detail/star-detail.service';
import { User } from 'src/user/entities/user.entity';
import { Role } from 'src/user/enums/roles.enum';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { BlogSearchService } from './blog.search.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { ResponseBlogDtoPag } from './dto/response-blog-pag.dto';
import { ResponseBlogDto } from './dto/response-blog.dto';
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
    private readonly blogSearchService: BlogSearchService,
    @Inject(forwardRef(() => StarDetailService))
    private readonly starDetailService: StarDetailService,
    @Inject(forwardRef(() => CommentService))
    private readonly commentService: CommentService,
    @Inject(Logger) private readonly logger: LoggerService,
    private readonly socketService: SocketService,
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
    this.blogSearchService.indexBlog(blog);
    this.logger.log(`Calling create() userId: ${userId}, blogId: ${saveBlog.id}`, BlogService.name);
    if (createBlogDto.hashTags && createBlogDto.hashTags?.length !== 0) {
      this.attachHashTag(createBlogDto.hashTags, saveBlog);
    }
    if (files.length) {
      this.attachMedia(files, saveBlog, createBlogDto.clientId);
    }
    return true;
  }

  async searchForBlogs(
    text: string,
    options: IPaginationOptions,
  ): Promise<ResponseBlogDtoPag | []> {
    if (text) {
      const searchResult = await this.blogSearchService.search(text);
      const ids = searchResult.map((result) => result.id);
      if (!ids.length) {
        return [];
      }
      const queryBuilder = this.blogRepository
        .createQueryBuilder('blog')
        .where('blog.id IN (:...ids)', { ids })
        .leftJoin('blog.user', 'user')
        .addSelect('user.id')
        .orderBy('blog.id', 'DESC');
      const blogs = await paginate<Blog>(queryBuilder, options);
      const blogsDto = new ResponseBlogDtoPag();
      blogsDto.items = blogs.items.map((blog) => {
        return plainToClass(ResponseBlogDto, blog);
      });
      blogsDto.meta = blogs.meta;
      return blogsDto;
    }
    return [];
  }

  async attachMedia(files: Express.Multer.File[], blog: Blog, clientId: string): Promise<void> {
    const medias = await this.mediaService.uploadFileQueue(files);
    medias.forEach(async (md: { url: string; public_id: string; resource_type: string }) => {
      const media = new Media();
      media.url = md.url;
      media.cloudId = md.public_id;
      media.mediaType = md.resource_type;
      const saveMedia = await this.mediaService.save(media);
      const blogMedia = new BlogMedia();
      blogMedia.blog = blog;
      blogMedia.media = saveMedia;
      const result = await this.blogMediaService.save(blogMedia);
      if (result) {
        this.socketService.sendUploadSuccess(clientId, blog.id);
      }
    });
  }

  async attachHashTag(arrayHashTag: string[], blog: Blog): Promise<void> {
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
        hashTagBlogs: {
          hashTag: true,
        },
      },
    });
  }

  async findOne(id: number): Promise<Blog> {
    return await this.blogRepository.findOne({
      where: { id },
      relations: {
        blogMedias: {
          media: true,
        },
        hashTagBlogs: {
          hashTag: true,
        },
      },
    });
  }

  async findAllWithPag(options: IPaginationOptions): Promise<ResponseBlogDtoPag> {
    const queryBuilder = this.blogRepository
      .createQueryBuilder('blog')
      .leftJoin('blog.user', 'user')
      .addSelect('user.id')
      .orderBy('blog.id', 'DESC');
    const blogs = await paginate<Blog>(queryBuilder, options);
    const blogsDto = new ResponseBlogDtoPag();
    blogsDto.items = blogs.items.map((blog) => {
      return plainToClass(ResponseBlogDto, blog);
    });
    blogsDto.meta = blogs.meta;
    return blogsDto;
  }

  async update(
    id: number,
    updateBlogDto: UpdateBlogDto,
    files: Express.Multer.File[],
    userId: number,
  ): Promise<boolean> {
    const user = await this.userService.findOne(userId);
    const blog = await this.blogRepository.findOne({ where: { id }, relations: { user: true } });
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
    this.blogSearchService.update(saveBlog);
    this.logger.log(`Calling update() userId: ${userId}, blogId: ${id}`, BlogService.name);
    if (updateBlogDto.deleteHashTagIds || updateBlogDto.hashTags) {
      this.updateHashTag(updateBlogDto.deleteHashTagIds, updateBlogDto.hashTags, saveBlog);
    }
    if (updateBlogDto.deleteMediaIds || files.length !== 0) {
      this.updateMedia(updateBlogDto.deleteMediaIds, files, saveBlog, updateBlogDto.clientId);
    }
    return true;
  }

  async updateHashTag(deleteHashTagIds: number[], hashTags: string[], blog: Blog): Promise<void> {
    if (deleteHashTagIds) {
      deleteHashTagIds.forEach((ht) => {
        this.hashTagBlogService.deleteByBlogIdAndHashTagId(blog.id, ht);
      });
    }
    if (hashTags) {
      this.attachHashTag(hashTags, blog);
    }
  }

  async updateMedia(
    deleteMediaIds: number[],
    files: Express.Multer.File[],
    blog: Blog,
    clientId: string,
  ): Promise<void> {
    if (deleteMediaIds) {
      await Promise.all(
        deleteMediaIds.map(async (md) => {
          await this.blogMediaService.deleteByBlogIdAndMediaId(blog.id, md);
        }),
      );
    }
    if (files.length !== 0) {
      this.attachMedia(files, blog, clientId);
    }
  }

  async remove(id: number, userId: number): Promise<boolean> {
    const user = await this.userService.findOne(userId);
    const blog = await this.blogRepository.findOne({
      where: { id },
      relations: {
        user: true,
      },
    });
    if (user.role === Role.EMPLOYEE && user.id !== blog.user.id) {
      throw new HttpException('Not the owner', HttpStatus.BAD_REQUEST);
    }
    await this.blogRepository.softDelete(id);
    await this.blogSearchService.remove(blog);
    this.logger.log(`Calling remove() userId: ${userId}, blogId: ${id}`, BlogService.name);
    return true;
  }

  async getMediasByBlogId(blogId: number): Promise<Media[]> {
    return this.mediaService.getMediaByBlogId(blogId);
  }

  async getCommentsByBlogId(blogId: number): Promise<Comment[]> {
    return this.commentService.getCommentByBlogId(blogId);
  }

  async getHashTagByBlogId(blogId: number): Promise<HashTag[]> {
    return this.hashTagService.getHashTagByBlogId(blogId);
  }

  async getStarByBlogId(blogId: number): Promise<StarDetail[]> {
    return this.starDetailService.getStarOfBlog(blogId);
  }
}
