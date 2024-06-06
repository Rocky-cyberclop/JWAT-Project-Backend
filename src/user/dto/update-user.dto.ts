import { IsEnum, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { Gender } from '../enums/gender.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  @IsPhoneNumber('VN')
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;
}
