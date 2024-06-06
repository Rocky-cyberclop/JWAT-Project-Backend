import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class MediaService {
  constructor() {}

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
          resolve(result);
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
}
