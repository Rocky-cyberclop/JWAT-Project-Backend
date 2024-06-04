import { Module } from '@nestjs/common';
import { StarDetailService } from './star-detail.service';
import { StarDetailController } from './star-detail.controller';

@Module({
  controllers: [StarDetailController],
  providers: [StarDetailService],
})
export class StarDetailModule {}
