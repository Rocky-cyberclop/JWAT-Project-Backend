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
    try {
      const result = await this.userRepository.save(createUserDto);
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

  async update(id: number, updateUserDto: UpdateUserDto): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { id: id },
      relations: { media: true },
    });
    if (!user) {
      throw new HttpException('User is not found', HttpStatus.NOT_FOUND);
    }
    const { avatar, ...userDtoNotAvt } = updateUserDto;
    Object.assign(user, userDtoNotAvt);
    let oldAvatarId: number;
    if (avatar) {
      const avatarUser = new Media();
      avatarUser.url = avatar;
      const newAvatar = await this.mediaRepository.save(avatarUser);
      if (user.media) {
        oldAvatarId = user.media.id;
      }
      user.media = newAvatar;
    }
    try {
      await this.userRepository.save(user);
      if (oldAvatarId) {
        await this.mediaRepository.delete(oldAvatarId);
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
