import { ArrayMinSize, IsArray, IsNumber } from 'class-validator';

export class AddUsersProjectRequest {
  @IsNumber()
  project: number;
  @IsArray()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  users: number[];
}
