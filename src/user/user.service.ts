import { Injectable } from '@nestjs/common';
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
    const newUser = this.userRepository.create(createUserDto);
    await this.userRepository.save(newUser);
    return newUser;
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
