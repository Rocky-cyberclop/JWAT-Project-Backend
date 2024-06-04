import { Module } from '@nestjs/common';
import { HashTagService } from './hash-tag.service';
import { HashTagController } from './hash-tag.controller';

@Module({
  controllers: [HashTagController],
  providers: [HashTagService],
})
export class HashTagModule {}
