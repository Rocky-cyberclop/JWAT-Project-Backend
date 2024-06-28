import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bull';
import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import * as streamifier from 'streamifier';
import { DeleteResult, Repository } from 'typeorm';
import { Media } from './entities/media.entity';
import { CreateBlogDto } from 'src/blog/dto/create-blog.dto';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,
    @InjectQueue('media') private mediaQueue: Queue,
  ) {}

  async uploadFileQueue(
    files: Express.Multer.File[], clientId: string
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    const job = await this.mediaQueue.add(
      'upload-file',
      {
        files,
        clientId
      },
      { removeOnComplete: true },
    );
    const queue = await this.mediaQueue.getJob(job.id);
    return await queue.finished();
  }

  async uploadFiles(
    files: Express.Multer.File[],
  ): Promise<(UploadApiResponse | UploadApiErrorResponse)[]> {
    return Promise.all(files.map((file) => this.uploadFile(file)));
  }

  private uploadFile(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise<UploadApiResponse | UploadApiErrorResponse>((resolve, reject) => {
      const resourceType = file.mimetype.startsWith('video/') ? 'video' : 'image';
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'media_project_php_jwat', resource_type: resourceType },
        (error, result) => {
          if (error) return reject(error);
          return resolve(result);
        },
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async deleteMedia(publicId: string, mediaType: string): Promise<any> {
    try {
      const result = await cloudinary.uploader.destroy(publicId, { resource_type: mediaType });
      return result;
    } catch (error) {
      throw new Error(`Failed to delete image: ${error.message}`);
    }
  }

  async save(media: Media): Promise<Media> {
    return await this.mediaRepository.save(media);
  }

  async deleteById(id: number): Promise<DeleteResult> {
    return await this.mediaRepository.delete(id);
  }

  async getMediaByBlogId(blogId: number): Promise<Media[]> {
    return this.mediaRepository.find({
      where: {
        blogMedias: {
          blog: { id: blogId },
        },
      },
    });
  }
}
