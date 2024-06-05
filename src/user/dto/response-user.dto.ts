import { Exclude } from 'class-transformer';
import { Gender } from '../enums/gender.enum';
import { Role } from '../enums/roles.enum';

export class ResponseUserDto {
  fullName: string;
  phoneNumber: string;
  email: string;
  gender: Gender;
  dob: string;
  address: string;
  username: string;
  roles: Role;

  @Exclude()
  password: string;

  @Exclude()
  refreshToken: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  deleteAt: Date;
}
