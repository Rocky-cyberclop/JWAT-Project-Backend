import { IsString } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  description: string;

  @IsString()
  name: string;
}
