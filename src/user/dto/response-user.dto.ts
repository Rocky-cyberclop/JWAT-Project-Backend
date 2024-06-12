import { Exclude } from 'class-transformer';
import { Gender } from '../enums/gender.enum';
import { Role } from '../enums/roles.enum';

export class ResponseUserDto {
  id: number;
  fullName: string;
  phoneNumber: string;
  email: string;
  gender: Gender;
  dob: string;
  address: string;
  username: string;
  role: Role;

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
