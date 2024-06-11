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

  async findAllWithUser(userId: any): Promise<Project[]> {
    const userDoesProjects = await this.userProjectRepository.find({
      relations: ['project.media', 'user'],
      where: { user: { id: userId } },
    });
    console.log(userDoesProjects);
    const projects = new Array<Project>();
    userDoesProjects.forEach((userDoesProject: UserProject) => {
      projects.push(userDoesProject.project);
    });
    return projects;
  }

  async findOne(id: number): Promise<Project> {
    return await this.projectRepository.findOne({ relations: ['media'], where: { id: id } });
  }

  async findWithSearch(idUser: number, query: SearchProjectDto): Promise<Project[]> {
    if (query && query.name.length === 0) return this.findAllWithUser(idUser);
    const allProjectWithUser = await this.findAllWithUser(idUser);
    const rawSearch = query.name.toLowerCase();
    const res = allProjectWithUser.filter((project: Project) => {
      const rawProjectName = project.name.toLowerCase();
      return rawProjectName.includes(rawSearch) || rawSearch.includes(rawProjectName);
    });
    return res;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto): Promise<UpdateResult> {
    return await this.projectRepository.update(id, updateProjectDto);
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.projectRepository.softDelete(id);
  }
}
