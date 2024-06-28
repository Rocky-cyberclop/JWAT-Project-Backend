import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBlogDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  hashTags: string[];

  @IsNotEmpty()
  @IsString()
  clientId: string;
}
