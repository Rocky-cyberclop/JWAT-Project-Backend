import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UserProject } from 'src/user-project/entities/user-project.entity';
import { User } from 'src/user/entities/user.entity';
import { Media } from 'src/media/entities/media.entity';
import { MediaService } from 'src/media/media.service';
import { SearchProjectDto } from './dto/search-project.dto';
import { ResponseProjectDto } from './dto/response-project-dto';
import { Role } from 'src/user/enums/roles.enum';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(UserProject)
    private userProjectRepository: Repository<UserProject>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly mediaService: MediaService,
  ) {}
  async create(
    managerId: number,
    createProjectDto: CreateProjectDto,
    files: Express.Multer.File[],
  ): Promise<Project> {
    const project = this.projectRepository.create(createProjectDto);
    if (files && files.length > 0) {
      const media = new Media();
      const medias = await this.mediaService.uploadFiles(files);
      medias.forEach((cloudSavedMedia) => {
        media.url = cloudSavedMedia.url;
        media.cloudId = cloudSavedMedia.public_id;
        media.mediaType = cloudSavedMedia.resource_type;
      });
      const savedMedia = await this.mediaService.save(media);
      project.media = savedMedia;
    }
    await this.projectRepository.save(project);
    const user = await this.userRepository.findOneBy({ id: managerId });
    const userProject = new UserProject();
    userProject.role = user.role;
    userProject.project = project;
    userProject.user = user;
    await this.userProjectRepository.save(userProject);
    return project;
  }

  async findAll(): Promise<Project[]> {
    return await this.projectRepository.find();
  }

  async findAllWithUser(userId: any): Promise<ResponseProjectDto[]> {
    const userDoesProjects = await this.userProjectRepository.find({
      relations: ['project.media', 'user'],
      where: { user: { id: userId } },
    });
    const projects = new Array<ResponseProjectDto>();
    const projectPromise = userDoesProjects.map(async (userDoesProject: UserProject) => {
      const responseProject: ResponseProjectDto = {
        name: userDoesProject.project.name,
        description: userDoesProject.project.description,
        createdAt: userDoesProject.createdAt,
        media: userDoesProject.project.media,
      };
      const projectOwner = await this.userProjectRepository.findOne({
        relations: ['user', 'project'],
        where: { project: { id: userDoesProject.project.id }, role: Role.MANAGER },
        select: { user: { id: true } },
      });
      responseProject.owner = projectOwner.user.id.toString();
      projects.push(responseProject);
    });
    await Promise.all(projectPromise);
    return projects;
  }

  async findOne(id: number): Promise<Project> {
    return await this.projectRepository.findOne({
      relations: ['media'],
      where: { id: id },
    });
  }

  async findWithSearch(idUser: number, query: SearchProjectDto): Promise<ResponseProjectDto[]> {
    const allProjectWithUser = await this.findAllWithUser(idUser);
    if (query && query.name.length === 0) return allProjectWithUser;
    const rawSearch = query.name.toLowerCase();
    const res = allProjectWithUser.filter((project: ResponseProjectDto) => {
      const rawProjectName = project.name.toLowerCase();
      return rawProjectName.includes(rawSearch) || rawSearch.includes(rawProjectName);
    });
    return res;
  }

  async update(
    id: number,
    updateProjectDto: UpdateProjectDto,
    files: Express.Multer.File[],
  ): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id: id },
      relations: ['media'],
    });
    project.name = updateProjectDto.name;
    project.description = updateProjectDto.description;
    if (files && files.length !== 0) {
      if (project.media) {
        const oldMediaId = project.media.id;
        const oldCloudId = project.media.cloudId;
        const oldMediaType = project.media.mediaType;
        project.media = null;
        await this.projectRepository.save(project);
        await this.mediaService.deleteById(oldMediaId);
        await this.mediaService.deleteMedia(oldCloudId, oldMediaType);
      }
      const media = new Media();
      const medias = await this.mediaService.uploadFiles(files);
      medias.forEach((cloudSavedMedia) => {
        media.url = cloudSavedMedia.url;
        media.cloudId = cloudSavedMedia.public_id;
        media.mediaType = cloudSavedMedia.resource_type;
      });
      const savedMedia = await this.mediaService.save(media);
      project.media = savedMedia;
    }
    return await this.projectRepository.save(project);
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.projectRepository.softDelete(id);
  }
}
