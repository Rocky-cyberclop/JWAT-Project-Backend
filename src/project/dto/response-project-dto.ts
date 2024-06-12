import { Media } from 'src/media/entities/media.entity';

export type ResponseProjectDto = {
  id: number;
  name: string;
  description: string;
  media: Media;
  createdAt: Date;
  owner?: string;
};
