import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BlogMediaService } from './blog-media.service';
import { CreateBlogMediaDto } from './dto/create-blog-media.dto';
import { UpdateBlogMediaDto } from './dto/update-blog-media.dto';

@Controller('blog-media')
export class BlogMediaController {
  constructor(private readonly blogMediaService: BlogMediaService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogMediaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBlogMediaDto: UpdateBlogMediaDto) {
    return this.blogMediaService.update(+id, updateBlogMediaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogMediaService.remove(+id);
  }

  @Post()
  create(@Body() createBlogMediaDto: CreateBlogMediaDto) {
    return this.blogMediaService.create(createBlogMediaDto);
  }

  @Get()
  findAll() {
    return this.blogMediaService.findAll();
  }
}
