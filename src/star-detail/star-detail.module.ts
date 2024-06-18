import { Module } from '@nestjs/common';
import { StarDetailService } from './star-detail.service';
import { StarDetailController } from './star-detail.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StarDetail } from './entities/star-detail.entity';
import { BlogModule } from 'src/blog/blog.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports:[TypeOrmModule.forFeature([StarDetail]), BlogModule, UserModule],
  controllers: [StarDetailController],
  providers: [StarDetailService],
})
export class StarDetailModule {}
