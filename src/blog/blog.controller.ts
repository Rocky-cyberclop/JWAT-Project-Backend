import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/decorator/roles.decorator';
import { FileInterceptor } from 'src/interceptor/media.interceptor';
import { Role } from 'src/user/enums/roles.enum';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { ResponseBlogDtoPag } from './dto/response-blog-pag.dto';
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

  @Get('search')
  search(
    @Query('text') searchString: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(8), ParseIntPipe) limit: number = 8,
  ): Promise<ResponseBlogDtoPag> {
    return this.blogService.searchForBlogs(searchString, { limit, page });
  }

  @Get('all')
  getAllWithPag(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(8), ParseIntPipe) limit: number = 8,
  ): Promise<ResponseBlogDtoPag> {
    return this.blogService.findAllWithPag({ limit, page });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(+id);
  }

  @Roles(Role.EMPLOYEE, Role.MANAGER)
  @Patch(':id')
  @UseInterceptors(FilesInterceptor('files', 5, new FileInterceptor().createMulterOptions()))
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.blogService.update(+id, updateBlogDto, files, req.user.id);
  }

  @Roles(Role.EMPLOYEE, Role.MANAGER)
  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string): Promise<boolean> {
    return this.blogService.remove(+id, req.user.id);
  }

  @Get()
  findAll() {
    return this.blogService.findAll();
  }
}
