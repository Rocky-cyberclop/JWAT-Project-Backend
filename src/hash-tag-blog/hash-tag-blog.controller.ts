import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HashTagBlogService } from './hash-tag-blog.service';
import { CreateHashTagBlogDto } from './dto/create-hash-tag-blog.dto';
import { UpdateHashTagBlogDto } from './dto/update-hash-tag-blog.dto';

@Controller('hash-tag-blog')
export class HashTagBlogController {
  constructor(private readonly hashTagBlogService: HashTagBlogService) {}

  @Post()
  create(@Body() createHashTagBlogDto: CreateHashTagBlogDto) {
    return this.hashTagBlogService.create(createHashTagBlogDto);
  }

  @Get()
  findAll() {
    return this.hashTagBlogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hashTagBlogService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHashTagBlogDto: UpdateHashTagBlogDto) {
    return this.hashTagBlogService.update(+id, updateHashTagBlogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hashTagBlogService.remove(+id);
  }
}
