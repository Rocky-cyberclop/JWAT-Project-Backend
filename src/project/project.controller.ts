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
  Res,
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
import { Document } from 'src/document/entities/document.entity';
import { join } from 'path';
import { Response } from 'express';
import { GroupingDocumentRequest } from './dto/group-document-request.dto';
import { UnGroupDocumentRequest } from './dto/ungroup-document.dto';
import { UpdateGroupDocumentRequest } from './dto/update-group-request.dto';
import { DocumentGroup } from 'src/document/entities/document.group.entity';
import { Public } from 'src/decorator/public.decorator';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('document/grouping')
  @Roles(Role.MANAGER)
  groupingDocuments(
    @Body() groupsDocumentRequest: GroupingDocumentRequest,
  ): Promise<GroupingDocumentRequest> {
    return this.projectService.groupingDocument(groupsDocumentRequest);
  }

  @Post('document/:id')
  @Roles(Role.MANAGER)
  @UseInterceptors(FilesInterceptor('files', null, new DocumentInterceptor().createMulterOptions()))
  addDocumentToProject(
    @Req() req: any,
    @Param('id') id: number,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<Document[]> {
    if (req.fileValidationError) {
      throw new HttpException(req.fileValidationError, HttpStatus.BAD_REQUEST);
    }
    return this.projectService.addDocuments(id, files);
  }

  @Post('knowledge')
  @Roles(Role.MANAGER)
  @UseInterceptors(FilesInterceptor('files', 1, new FileInterceptor().createMulterOptions()))
  addKnowledgeToProject(
    @Body() addRequest: AddKnowledgeProjectDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<AddKnowledgeProjectDto> {
    return this.projectService.addKnowledgeToProject(addRequest, files);
  }

  @Post('addUsers')
  @Roles(Role.MANAGER)
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

  @Get('document/group/:id')
  @Roles(Role.MANAGER)
  getGroupingDocument(@Param('id') id: number): Promise<any> {
    return this.projectService.getDocumentInGroup(id);
  }

  @Get('document/file/:name')
  @Public()
  getFileDocumentFromProject(@Param('name') name: string, @Res() res: Response) {
    const filePath = join(__dirname, '..', '..', '..', 'uploads/documents', name);
    res.sendFile(filePath);
  }

  @Get('document/:id/search')
  @Roles(Role.MANAGER)
  getDocumentByName(@Param('id') id: number, @Query('name') name: string): Promise<Document[]> {
    return this.projectService.getDocumentByName(id, name);
  }

  @Get('findUserNotIn/:id/searchUser')
  @Roles(Role.MANAGER)
  findUserInProjectWithId(
    @Param('id') id: number,
    @Query('userId') userId: number,
  ): Promise<ResponseUserDto[]> {
    return this.projectService.findUsersInProjectWithId(id, userId);
  }

  @Get('document/:id')
  getDocumentsFromProject(@Param('id') id: number): Promise<Document[]> {
    return this.projectService.getDocuments(id);
  }

  @Get('knowledge/:id')
  findKnowledgesInProject(@Param('id') id: number): Promise<Knowledge[]> {
    return this.projectService.findKnowledgesInProject(id);
  }

  @Get('findUserIn/:id')
  @Roles(Role.MANAGER)
  findUserInProject(@Param('id') id: number): Promise<ResponseUserDto[]> {
    return this.projectService.findUsersInProject(id);
  }

  @Get('findUserNotIn')
  @Roles(Role.MANAGER)
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

  @Patch('document/group')
  @Roles(Role.MANAGER)
  updateGroupDocument(
    @Body() updateGroupDocumentRequest: UpdateGroupDocumentRequest,
  ): Promise<DocumentGroup> {
    return this.projectService.updateGroupDocument(updateGroupDocumentRequest);
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

  @Delete('document/group/:id')
  @Roles(Role.MANAGER)
  removeGroupingDocument(@Param('id') id: number): Promise<DeleteResult> {
    return this.projectService.removeGroupDocument(id);
  }

  @Delete('document/grouping')
  @Roles(Role.MANAGER)
  ungroupingDocuments(
    @Body() unGroupDocumentRequest: UnGroupDocumentRequest,
  ): Promise<UnGroupDocumentRequest> {
    return this.projectService.ungroupDocument(unGroupDocumentRequest);
  }

  @Delete('document/:id')
  @Roles(Role.MANAGER)
  removeDocumentFromProject(@Param('id') id: number): Promise<DeleteResult> {
    return this.projectService.deleteDocument(id);
  }

  @Delete('knowledge/:id')
  @Roles(Role.MANAGER)
  removeKnowledgeFromProject(@Param('id') id: number): Promise<DeleteResult> {
    return this.projectService.removeKnowledgeFromProject(id);
  }

  @Delete('removeUsers')
  @Roles(Role.MANAGER)
  removeUsersFromProject(@Body() addRequest: AddUsersProjectRequest): Promise<DeleteResult> {
    return this.projectService.removeUsersFromProject(addRequest);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.projectService.remove(+id);
  }
}
