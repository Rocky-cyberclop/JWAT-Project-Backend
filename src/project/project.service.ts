import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, In, Repository } from 'typeorm';
import { UserProject } from 'src/user-project/entities/user-project.entity';
import { User } from 'src/user/entities/user.entity';
import { Media } from 'src/media/entities/media.entity';
import { MediaService } from 'src/media/media.service';
import { SearchProjectDto } from './dto/search-project.dto';
import { ResponseProjectDto } from './dto/response-project-dto';
import { Role } from 'src/user/enums/roles.enum';
import { AddUsersProjectRequest } from './dto/add-user-project-request.dto';
import { ResponseUserDto } from 'src/user/dto/response-user.dto';
import { plainToClass } from 'class-transformer';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { UserNotInResponse } from './dto/user-not-in.dto';
import { MailService } from 'src/mail/mail.service';
import { MutateProjectMailDto } from 'src/mail/dto/mail-info-mutate-project.dto';

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
    private readonly mailService: MailService,
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
        id: userDoesProject.id,
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

  async findUsersNotInProject(
    options: IPaginationOptions,
    projectId: number,
  ): Promise<UserNotInResponse> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.userProjects', 'userProject', 'userProject.projectId = :projectId', {
        projectId,
      })
      .where('userProject.projectId IS NULL');

    const userNotIn = await paginate<User>(queryBuilder, options);
    const userNotInResponse = new UserNotInResponse();
    userNotInResponse.items = userNotIn.items.map((user) => {
      return plainToClass(ResponseUserDto, user);
    });
    userNotInResponse.meta = userNotIn.meta;
    return userNotInResponse;
  }

  // Haven't tested the send mail when add users to project,
  // The foreach also has async, it maybe can make the multi thread processes
  async addUsersToProject(addRequest: AddUsersProjectRequest): Promise<AddUsersProjectRequest> {
    const users = await this.userRepository.find({ where: { id: In(addRequest.users) } });
    const project = await this.projectRepository.findOne({ where: { id: addRequest.project } });
    const userProjects = new Array<UserProject>();
    users.forEach(async (user) => {
      if (user.role === Role.MANAGER)
        throw new HttpException(
          `You can not add ${user.fullName} to this project cause he or she is a manager`,
          HttpStatus.BAD_REQUEST,
        );
      const userProject = new UserProject();
      userProject.user = user;
      userProject.project = project;
      userProject.role = user.role;
      userProjects.push(userProject);
      const mailDto: MutateProjectMailDto = {
        recipients: [{ name: user.fullName, address: user.email }],
        subject: 'Added to a new project',
        project: project.name,
      };
      await this.mailService.sendEmailAddToProject(mailDto);
    });
    await this.userProjectRepository.save(userProjects);
    return addRequest;
  }

  async findUsersInProject(projectId: number): Promise<ResponseUserDto[]> {
    const userProjects = await this.userProjectRepository.find({
      relations: ['user'],
      where: { project: { id: projectId } },
    });
    return userProjects.map((userProject): ResponseUserDto => {
      return plainToClass(ResponseUserDto, userProject.user);
    });
  }

  async removeUsersFromProject(addRequest: AddUsersProjectRequest): Promise<DeleteResult> {
    return await this.userProjectRepository.softDelete({
      project: { id: addRequest.project },
      user: { id: In(addRequest.users) },
    });
  }
}
