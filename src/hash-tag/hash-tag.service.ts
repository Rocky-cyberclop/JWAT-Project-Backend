import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHashTagDto } from './dto/create-hash-tag.dto';
import { UpdateHashTagDto } from './dto/update-hash-tag.dto';
import { HashTag } from './entities/hash-tag.entity';

@Injectable()
export class HashTagService {
  constructor(
    @InjectRepository(HashTag)
    private readonly hashTagRepository: Repository<HashTag>,
  ) {}

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

  async save(hashTag: HashTag): Promise<HashTag> {
    return await this.hashTagRepository.save(hashTag);
  }

  async findByName(hashTagName: string): Promise<HashTag> {
    return this.hashTagRepository.findOneBy({hashTagName})
  }
}
