import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StarDetailService } from './star-detail.service';
import { CreateStarDetailDto } from './dto/create-star-detail.dto';
import { UpdateStarDetailDto } from './dto/update-star-detail.dto';

@Controller('star-detail')
export class StarDetailController {
  constructor(private readonly starDetailService: StarDetailService) {}

  @Post()
  create(@Body() createStarDetailDto: CreateStarDetailDto) {
    return this.starDetailService.create(createStarDetailDto);
  }

  @Get()
  findAll() {
    return this.starDetailService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.starDetailService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStarDetailDto: UpdateStarDetailDto) {
    return this.starDetailService.update(+id, updateStarDetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.starDetailService.remove(+id);
  }
}
