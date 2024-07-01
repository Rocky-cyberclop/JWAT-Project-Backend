import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { SocketService } from 'src/socket/socket.service';
import { MediaService } from '../media.service';

@Processor('media')
export class MediaConsumer {
  constructor(
    private readonly mediaService: MediaService,
  ) {}

  @Process('upload-file')
  async uploadFileQueue(job: Job<unknown>) {
    const transformedFiles = job.data['files'].map((file) => ({
      ...file,
      buffer: Buffer.from(file.buffer.data),
    }));
    const result = await this.mediaService.uploadFiles(transformedFiles);
    return result;
  }
}
