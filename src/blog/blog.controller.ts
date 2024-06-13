import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/decorator/roles.decorator';
import { FileInterceptor } from 'src/interceptor/file.interceptor';
import { Role } from 'src/user/enums/roles.enum';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Roles(Role.EMPLOYEE, Role.MANAGER)
  @Post('create')
  @UseInterceptors(FilesInterceptor('files', 5, new FileInterceptor().createMulterOptions()))
  create(
    @Req() req: any,
    @Body() createBlogDto: CreateBlogDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<boolean> {
    if (req.fileValidationError) {
      throw new HttpException(req.fileValidationError, HttpStatus.BAD_REQUEST);
    }
    return this.blogService.create(req.user.id, createBlogDto, files);
  }

  @Get()
  findAll() {
    return this.blogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogService.update(+id, updateBlogDto);
  }

  @Roles(Role.EMPLOYEE, Role.MANAGER)
  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string): Promise<boolean> {
    return this.blogService.remove(+id, req.user.id);
  }
}
