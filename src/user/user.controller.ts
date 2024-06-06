import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Patch,
  Post,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/decorator/roles.decorator';
import { FileInterceptor } from 'src/interceptor/file.interceptor';
import { CreateUserDto } from './dto/create-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from './enums/roles.enum';
import { UserService } from './user.service';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  @Roles(Role.ADMIN)
  create(@Body() createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    return this.userService.create(createUserDto);
  }

  @Get('current')
  findOne(@Req() req: any): Promise<ResponseUserDto> {
    return this.userService.findOne(req.user.id);
  }

  @Patch('update')
  @UseInterceptors(FilesInterceptor('files', 1, new FileInterceptor().createMulterOptions()))
  update(
    @Req() req: any,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<boolean> {
    if (req.fileValidationError) {
      throw new HttpException(req.fileValidationError, HttpStatus.BAD_REQUEST);
    }
    if (!files) {
      throw new HttpException('File is require', HttpStatus.BAD_REQUEST);
    }
    return this.userService.update(req.user.id, updateUserDto, files);
  }
}
