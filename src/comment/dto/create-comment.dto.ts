import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsNumber()
  blogId: number;

  @IsNotEmpty()
  @IsString()
  content: string;
}
