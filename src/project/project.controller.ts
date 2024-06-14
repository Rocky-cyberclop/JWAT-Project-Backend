import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseInterceptors,
  UploadedFiles,
  HttpException,
  HttpStatus,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { DeleteResult } from 'typeorm';
import { FileInterceptor } from 'src/interceptor/file.interceptor';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/decorator/roles.decorator';
import { Role } from 'src/user/enums/roles.enum';
import { SearchProjectDto } from './dto/search-project.dto';
import { ResponseProjectDto } from './dto/response-project-dto';
import { AddUsersProjectRequest } from './dto/add-user-project-request.dto';
import { ResponseUserDto } from 'src/user/dto/response-user.dto';
import { UserNotInResponse } from './dto/user-not-in.dto';
import { AddKnowledgeProjectDto } from './dto/add-knowledge-request.dto';
import { Knowledge } from 'src/knowledge/entities/knowledge.entity';
import { DocumentInterceptor } from 'src/interceptor/document.interceptor';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Roles(Role.MANAGER)
  @Post('document/:id')
  @UseInterceptors(DocumentInterceptor)
  addDocumentToProject(
    @Param('id') id: number,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<void> {
    return null;
  }

  @Roles(Role.MANAGER)
  @Post('knowledge')
  @UseInterceptors(FilesInterceptor('files', 1, new FileInterceptor().createMulterOptions()))
  addKnowledgeToProject(
    @Body() addRequest: AddKnowledgeProjectDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<AddKnowledgeProjectDto> {
    return this.projectService.addKnowledgeToProject(addRequest, files);
  }

  @Roles(Role.MANAGER)
  @Post('addUsers')
  addUsersToProject(@Body() addRequest: AddUsersProjectRequest): Promise<AddUsersProjectRequest> {
    return this.projectService.addUsersToProject(addRequest);
  }

  @Post()
  @Roles(Role.MANAGER)
  @UseInterceptors(FilesInterceptor('files', 1, new FileInterceptor().createMulterOptions()))
  create(
    @Req() req: any,
    @Body() createProjectDto: CreateProjectDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<Project> {
    if (req.fileValidationError) {
      throw new HttpException(req.fileValidationError, HttpStatus.BAD_REQUEST);
    }
    return this.projectService.create(req.user.id, createProjectDto, files);
  }

  @Get('knowledge/:id')
  findKnowledgesInProject(@Param('id') id: number): Promise<Knowledge[]> {
    return this.projectService.findKnowledgesInProject(id);
  }

  @Roles(Role.MANAGER)
  @Get('findUserIn/:id')
  findUserInProject(@Param('id') id: number): Promise<ResponseUserDto[]> {
    return this.projectService.findUsersInProject(id);
  }

  @Roles(Role.MANAGER)
  @Get('findUserNotIn/:id/searchUser')
  findUserInProjectWithId(
    @Param('id') id: number,
    @Query('userId') userId: number = 1,
  ): Promise<ResponseUserDto[]> {
    return this.projectService.findUsersInProjectWithId(id, userId);
  }

  @Roles(Role.MANAGER)
  @Get('findUserNotIn')
  findUserNotInProject(
    @Query('id') id: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<UserNotInResponse> {
    return this.projectService.findUsersNotInProject({ page, limit }, id);
  }

  @Get('user')
  @Roles(Role.MANAGER, Role.EMPLOYEE)
  findAllWithUser(@Req() req: any): Promise<ResponseProjectDto[]> {
    return this.projectService.findAllWithUser(req.user.id);
  }

  @Get('search')
  findWithSearch(@Req() req: any, @Query() query: SearchProjectDto): Promise<ResponseProjectDto[]> {
    return this.projectService.findWithSearch(req.user.id, query);
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Project> {
    return this.projectService.findOne(+id);
  }

  @Get()
  @Roles(Role.ADMIN)
  findAll(): Promise<Project[]> {
    return this.projectService.findAll();
  }

  @Patch(':id')
  @Roles(Role.MANAGER)
  @UseInterceptors(FilesInterceptor('files', 1, new FileInterceptor().createMulterOptions()))
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<Project> {
    if (req.fileValidationError) {
      throw new HttpException(req.fileValidationError, HttpStatus.BAD_REQUEST);
    }
    return this.projectService.update(+id, updateProjectDto, files);
  }

  @Roles(Role.MANAGER)
  @Delete('knowledge/:id')
  removeKnowledgeFromProject(@Param('id') id: number): Promise<DeleteResult> {
    return this.projectService.removeKnowledgeFromProject(id);
  }

  @Roles(Role.MANAGER)
  @Delete('removeUsers')
  removeUsersFromProject(@Body() addRequest: AddUsersProjectRequest): Promise<DeleteResult> {
    return this.projectService.removeUsersFromProject(addRequest);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.projectService.remove(+id);
  }
}
