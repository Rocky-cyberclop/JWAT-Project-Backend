import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { BlogService } from 'src/blog/blog.service';
import { Blog } from 'src/blog/entities/blog.entity';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { StarDetail } from './entities/star-detail.entity';

@Injectable()
export class StarDetailService {
  constructor(
    @InjectRepository(StarDetail)
    private readonly starDetailRepository: Repository<StarDetail>,
    private readonly userService: UserService,
    @Inject(forwardRef(() => BlogService))
    private readonly blogService: BlogService,
  ) {}

  async createOrRemove(userId: number, blogId: number) {
    const blog = await this.blogService.findOne(blogId);
    const user = await this.userService.findOne(userId);
    const star = await this.starDetailRepository.findOne({
      where: { blog: { id: blogId }, user: { id: userId } },
    });
    if (!star) {
      const starDetail = new StarDetail();
      starDetail.blog = plainToClass(Blog, blog);
      starDetail.user = plainToClass(User, user);
      await this.starDetailRepository.save(starDetail);
    } else {
      await this.starDetailRepository.delete(star);
    }
  }

  async getStarOfBlog(blogId: number) {
    const stars = this.starDetailRepository
      .createQueryBuilder('star_detail')
      .leftJoin('star_detail.user', 'user')
      .select(['star_detail.id', 'user.id'])
      .where('star_detail.blogId = :blogId', { blogId })
      .getMany();
    return stars;
  }
}
