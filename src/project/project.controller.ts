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
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { FileInterceptor } from 'src/interceptor/file.interceptor';
import { FilesInterceptor } from '@nestjs/platform-express';

// @Roles(Role.MANAGER)
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
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

  @Get()
  findAll(): Promise<Project[]> {
    return this.projectService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Project> {
    return this.projectService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<UpdateResult> {
    return this.projectService.update(+id, updateProjectDto);
  }

  // @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.projectService.remove(+id);
  }
}
