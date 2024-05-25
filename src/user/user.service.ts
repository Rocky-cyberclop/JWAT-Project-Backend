import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;
    user.age = createUserDto.age;
    const savedUser = await this.userRepository.save(user);
    return savedUser;
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: id });
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UpdateResult> {
    const user = await this.userRepository.update(
      { id: id },
      updateUserDto,
    );
    return user;
  }

  async remove(id: number): Promise<DeleteResult> {
    const user = await this.userRepository.delete({ id: id });
    return user;
  }
}
