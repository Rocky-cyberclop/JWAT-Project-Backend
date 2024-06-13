import { IsString } from 'class-validator';

export class AddKnowledgeProjectDto {
  @IsString()
  project: string;
  @IsString()
  name: string;
}
