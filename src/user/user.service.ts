import { ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Media } from 'src/media/entities/media.entity';
import { MediaService } from 'src/media/media.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,
    private readonly mediaService: MediaService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    const userExist = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });
    if (userExist) {
      throw new ConflictException('Username already exists');
    }
    const { dob } = createUserDto;
    const newUser = this.userRepository.create(createUserDto);
    newUser.dob = new Date(dob);
    try {
      const result = await this.userRepository.save(newUser);
      if (result) {
        return plainToClass(ResponseUserDto, createUserDto);
      }
    } catch (error) {
      const errorMessage = error.detail;
      const attributeName = errorMessage.match(/\("?(.*?)"?\)/)[1];
      if (error.code === '23505') {
        throw new HttpException(attributeName, HttpStatus.BAD_REQUEST);
      } else {
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

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    files: Express.Multer.File[],
  ): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { id: id },
      relations: { media: true },
    });
    if (!user) {
      throw new HttpException('User is not found', HttpStatus.NOT_FOUND);
    }
    Object.assign(user, updateUserDto);
    let oldAvatarId: number;
    let oldCloudId: string;
    let oldMediaType: string;
    if (files.length !== 0) {
      const avatarUser = new Media();
      const avatars = await this.mediaService.uploadFiles(files);
      avatars.forEach((a) => {
        avatarUser.url = a.url;
        avatarUser.cloudId = a.public_id;
        avatarUser.mediaType = a.resource_type;
      });
      const newAvatar = await this.mediaRepository.save(avatarUser);
      if (user.media) {
        oldAvatarId = user.media.id;
        oldCloudId = user.media.cloudId;
        oldMediaType = user.media.mediaType;
      }
      user.media = newAvatar;
    }
    try {
      if (!updateUserDto.password) {
        const { password, ...updateUser } = user;
        await this.userRepository.update(user.id, updateUser);
      } else {
        await this.userRepository.update(user.id, user);
      }
      if (oldAvatarId && oldCloudId) {
        await this.mediaRepository.delete(oldAvatarId);
        await this.mediaService.deleteMedia(oldCloudId, oldMediaType);
      }
    } catch (error) {
      const errorMessage = error.detail;
      const attributeName = errorMessage.match(/\("?(.*?)"?\)/)[1];
      if (error.code === '23505') {
        throw new HttpException(attributeName, HttpStatus.BAD_REQUEST);
      } else {
        throw error;
      }
    }
    return true;
  }
}
