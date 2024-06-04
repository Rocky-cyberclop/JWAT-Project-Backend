import { Injectable } from '@nestjs/common';
import { CreateHashTagDto } from './dto/create-hash-tag.dto';
import { UpdateHashTagDto } from './dto/update-hash-tag.dto';

@Injectable()
export class HashTagService {
  create(createHashTagDto: CreateHashTagDto) {
    return 'This action adds a new hashTag';
  }

  findAll() {
    return `This action returns all hashTag`;
  }

  findOne(id: number) {
    return `This action returns a #${id} hashTag`;
  }

  update(id: number, updateHashTagDto: UpdateHashTagDto) {
    return `This action updates a #${id} hashTag`;
  }

  remove(id: number) {
    return `This action removes a #${id} hashTag`;
  }
}
