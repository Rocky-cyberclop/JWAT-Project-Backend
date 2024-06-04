import { PartialType } from '@nestjs/mapped-types';
import { CreateHashTagDto } from './create-hash-tag.dto';

export class UpdateHashTagDto extends PartialType(CreateHashTagDto) {}
