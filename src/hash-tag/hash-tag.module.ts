import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashTag } from './entities/hash-tag.entity';
import { HashTagService } from './hash-tag.service';

@Module({
  imports: [TypeOrmModule.forFeature([HashTag])],
  providers: [HashTagService],
  exports: [HashTagService],
})
export class HashTagModule {}
