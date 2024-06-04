import { Injectable } from '@nestjs/common';
import { CreateStarDetailDto } from './dto/create-star-detail.dto';
import { UpdateStarDetailDto } from './dto/update-star-detail.dto';

@Injectable()
export class StarDetailService {
  create(createStarDetailDto: CreateStarDetailDto) {
    return 'This action adds a new starDetail';
  }

  findAll() {
    return `This action returns all starDetail`;
  }

  findOne(id: number) {
    return `This action returns a #${id} starDetail`;
  }

  update(id: number, updateStarDetailDto: UpdateStarDetailDto) {
    return `This action updates a #${id} starDetail`;
  }

  remove(id: number) {
    return `This action removes a #${id} starDetail`;
  }
}
