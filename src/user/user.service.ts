import { ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const userExist = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });
    if (userExist) {
      throw new ConflictException('Username already exists');
    }
    const newUser = this.userRepository.create(createUserDto);

    try {
      return await this.userRepository.save(newUser);
    } catch (error) {
      if (error.code === '23505') {
        throw new HttpException(
          'Duplicate key value violates unique constraint',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        throw error;
      }
    }
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({
      id: id,
    });
    return user;
  }

  // async update(id: number, updateUserDto: UpdateUserDto): Promise<UpdateResult> {
  //   const user = await this.userRepository.update(
  //     { id: id },
  //     updateUserDto,
  //   );
  //   return user;
  // }

  // async remove(id: number): Promise<DeleteResult> {
  //   const user = await this.userRepository.delete({ id: id });
  //   return user;
  // }
}
