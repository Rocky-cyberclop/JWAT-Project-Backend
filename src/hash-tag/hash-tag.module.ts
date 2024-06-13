import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashTag } from './entities/hash-tag.entity';
import { HashTagController } from './hash-tag.controller';
import { HashTagService } from './hash-tag.service';

@Module({
  imports: [TypeOrmModule.forFeature([HashTag])],
  controllers: [HashTagController],
  providers: [HashTagService],
  exports: [HashTagService],
})
export class HashTagModule {}
