import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HashTagService } from './hash-tag.service';
import { CreateHashTagDto } from './dto/create-hash-tag.dto';
import { UpdateHashTagDto } from './dto/update-hash-tag.dto';

@Controller('hash-tag')
export class HashTagController {
  constructor(private readonly hashTagService: HashTagService) {}

  @Post()
  create(@Body() createHashTagDto: CreateHashTagDto) {
    return this.hashTagService.create(createHashTagDto);
  }

  @Get()
  findAll() {
    return this.hashTagService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hashTagService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHashTagDto: UpdateHashTagDto) {
    return this.hashTagService.update(+id, updateHashTagDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hashTagService.remove(+id);
  }
}
