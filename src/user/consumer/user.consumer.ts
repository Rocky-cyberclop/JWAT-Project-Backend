import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { UserService } from '../user.service';

@Processor('user')
export class UserConsumer {
  constructor(private readonly userService: UserService) {}

  @Process('upload-file')
  async uploadFileQueue(job: Job<unknown>) {
    const transformedFiles = job.data['files'].map((file) => ({
      ...file,
      buffer: Buffer.from(file.buffer.data),
    }));
    return await this.userService.update(
      job.data['id'],
      job.data['updateUserDto'],
      transformedFiles,
    );
  }
}
