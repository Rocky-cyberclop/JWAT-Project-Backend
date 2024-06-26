import {
  Body,
  Controller,
  DefaultValuePipe,
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
import { ChangePasswordUserDto } from './dto/change-password-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ResponseUserDtoPag } from './dto/response-user-pag.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from './enums/roles.enum';
import { UserService } from './user.service';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  @Roles(Role.ADMIN)
  create(@Req() req: any, @Body() createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    return this.userService.create(req.user.id, createUserDto);
  }

  @Get('get-role')
  getRole(@Req() req: any): Promise<Role> {
    return this.userService.getRole(req.user.id);
  }

  @Get('current')
  currentUser(@Req() req: any): Promise<ResponseUserDto> {
    return this.userService.findOne(req.user.id);
  }

  @Get('all-user-pag')
  getAllUserWithPag(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(8), ParseIntPipe) limit: number = 8,
  ): Promise<ResponseUserDtoPag> {
    return this.userService.findAllUserPag({ limit, page });
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
    return this.userService.update(req.user.id, updateUserDto, files);
  }

  @Patch('change-password')
  changePassword(
    @Req() req: any,
    @Body() changePasswordUserDto: ChangePasswordUserDto,
  ): Promise<boolean> {
    return this.userService.changePassword(req.user.id, changePasswordUserDto);
  }

  @Get(':id')
  findById(@Param('id') id: number): Promise<ResponseUserDto> {
    return this.userService.findOne(+id);
  }
}
