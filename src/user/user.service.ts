import {
  ConflictException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  LoggerService,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { CreateUserMailDto } from 'src/mail/dto/mail.dto';
import { MailService } from 'src/mail/mail.service';
import { Media } from 'src/media/entities/media.entity';
import { MediaService } from 'src/media/media.service';
import { Repository, UpdateResult } from 'typeorm';
import { ChangePasswordUserDto } from './dto/change-password-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ResponseUserDtoPag } from './dto/response-user-pag.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Role } from './enums/roles.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mediaService: MediaService,
    private readonly mailService: MailService,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {}

  async findOneByUsername(username: string): Promise<User> {
    return await this.userRepository.findOneBy({ username });
  }

  async findOneByIdAndRefreshToken(id: number, refreshToken: string): Promise<User> {
    return await this.userRepository.findOneBy({
      id,
      refreshToken,
    });
  }

  async updateById(id: number, user: Partial<User>): Promise<UpdateResult> {
    return await this.userRepository.update(id, user);
  }

  async create(adminId: number, createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    const userExist = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });
    if (userExist) {
      throw new ConflictException('Username already exists');
    }
    const { dob } = createUserDto;
    const newUser = this.userRepository.create(createUserDto);
    newUser.dob = new Date(dob);
    newUser.userCreateId = adminId;
    try {
      const result = await this.userRepository.save(newUser);
      this.logger.log(
        `Calling create() adminId: ${adminId}, userId: ${result.id}`,
        UserService.name,
      );
      if (result) {
        const mailDto: CreateUserMailDto = {
          recipients: [{ name: newUser.fullName, address: newUser.email }],
          subject: 'Account Employee',
          username: newUser.username,
          password: newUser.username,
        };
        this.mailService.sendEmail(mailDto);
        return plainToClass(ResponseUserDto, result);
      }
    } catch (error) {
      const errorMessage = error.detail || error.message;
      const attributeName = errorMessage.match(/\("?(.*?)"?\)/)[1];
      if (error.code === '23505') {
        throw new HttpException(attributeName, HttpStatus.BAD_REQUEST);
      } else {
        this.logger.error(`Calling create() adminId: ${adminId}`, error, UserService.name);
        throw error;
      }
    }
  }

  async findOne(id: number): Promise<ResponseUserDto> {
    const user = await this.userRepository.findOne({
      where: { id: id },
      relations: { media: true },
    });
    if (!user) {
      throw new HttpException('User is not found', HttpStatus.NOT_FOUND);
    }
    return plainToClass(ResponseUserDto, user);
  }

  async getRole(id: number): Promise<Role> {
    const user = await this.userRepository.findOneBy({ id });
    return user.role;
  }

  async changePassword(id: number, changePasswordUserDto: ChangePasswordUserDto): Promise<boolean> {
    const user = await this.userRepository.findOneBy({ id });
    const verify = await user.comparePassword(changePasswordUserDto.oldPassword);
    if (!verify) {
      throw new HttpException(
        {
          message: 'Password does not correct.',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    user.password = changePasswordUserDto.password;
    await this.userRepository.update(id, user);
    this.logger.log(`Calling changePassword() userId: ${id}`, UserService.name);
    return true;
  }

  async updateAvatar(id: number, files: Express.Multer.File[]): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { media: true },
    });
    if (!user) {
      throw new HttpException('User is not found', HttpStatus.NOT_FOUND);
    }
    let oldAvatarId: number;
    let oldCloudId: string;
    let oldMediaType: string;
    if (files.length !== 0) {
      const avatarUser = new Media();
      const avatars = await this.mediaService.uploadAvatarQueue(files);
      avatars.forEach((a) => {
        avatarUser.url = a.url;
        avatarUser.cloudId = a.public_id;
        avatarUser.mediaType = a.resource_type;
      });
      const newAvatar = await this.mediaService.save(avatarUser);
      if (user.media) {
        oldAvatarId = user.media.id;
        oldCloudId = user.media.cloudId;
        oldMediaType = user.media.mediaType;
      }
      user.media = newAvatar;
    }
    const { password, ...updateUser } = user;
    await this.userRepository.update(id, updateUser);
    if (oldAvatarId && oldCloudId) {
      this.mediaService.deleteById(oldAvatarId);
      this.mediaService.deleteMedia(oldCloudId, oldMediaType);
    }
    return true;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    files: Express.Multer.File[],
  ): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new HttpException('User is not found', HttpStatus.NOT_FOUND);
    }
    Object.assign(user, updateUserDto);
    try {
      const { password, ...updateUser } = user;
      await this.userRepository.update(user.id, updateUser);
      this.logger.log(`Calling update() userId: ${id}`, UserService.name);
      if (files.length !== 0) {
        this.updateAvatar(id, files);
      }
    } catch (error) {
      const errorMessage = error.detail || error.message;
      const attributeName = errorMessage.match(/\("?(.*?)"?\)/)[1];
      if (error.code === '23505') {
        throw new HttpException(attributeName, HttpStatus.BAD_REQUEST);
      } else {
        this.logger.error(`Calling update() userId: ${id}`, error, UserService.name);
        throw error;
      }
    }
    return true;
  }

  async findAllUserPag(options: IPaginationOptions): Promise<ResponseUserDtoPag> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.media', 'media')
      .orderBy('user.id', 'ASC');
    const users = await paginate<User>(queryBuilder, options);
    const usersDto = new ResponseUserDtoPag();
    usersDto.items = users.items.map((user) => {
      return plainToClass(ResponseUserDto, user);
    });
    usersDto.meta = users.meta;
    return usersDto;
  }
}
