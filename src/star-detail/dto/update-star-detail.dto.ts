import { PartialType } from '@nestjs/mapped-types';
import { CreateStarDetailDto } from './create-star-detail.dto';

export class UpdateStarDetailDto extends PartialType(CreateStarDetailDto) {}
