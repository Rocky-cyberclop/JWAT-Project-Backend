import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MediaService } from '../media.service';

@Processor('media')
export class MediaConsumer {
  constructor(private readonly mediaService: MediaService) {}

  @Process('upload-file')
  async uploadFileQueue(job: Job<unknown>) {
    const transformedFiles = job.data['files'].map((file) => ({
      ...file,
      buffer: Buffer.from(file.buffer.data),
    }));
    await this.mediaService.uploadFiles(transformedFiles);
  }
}
