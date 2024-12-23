import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { ConfigService } from '@nestjs/config';
import { User } from '../user/entities/user.entity';
import { BufferedFile } from './file.model';
import * as crypto from 'crypto';

@Injectable()
export class MinioClientService {
  private readonly logger: Logger;
  private readonly baseBucket: string;

  public get client() {
    return this.minio.client;
  }

  constructor(
    private readonly configService: ConfigService,
    private readonly minio: MinioService,
  ) {
    this.logger = new Logger('MinioStorageService');
    this.baseBucket = this.configService.get('MINIO_BUCKET');
  }

  public async uploadProfileImgs(
    user: User,
    files: BufferedFile[],
    categoryName: string,
    baseBucket: string = this.baseBucket,
  ): Promise<string[]> {
    const uploadedUrls: string[] = [];
    for (const file of files) {
      if (
        !(
          file.mimetype.includes('png') ||
          file.mimetype.includes('jpg') ||
          file.mimetype.includes('jpeg')
        )
      ) {
        throw new HttpException('Error uploading file', HttpStatus.BAD_REQUEST);
      }
      const temp_filename = Date.now().toString();
      const hashedFileName = crypto
        .createHash('md5')
        .update(temp_filename)
        .digest('hex');

      const ext = file.originalname.substring(
        file.originalname.lastIndexOf('.'),
        file.originalname.length,
      );

      const metaData = {
        'Content-Type': file.mimetype,
        'X-Amz-Meta-Testing': 1234,
      };
      const filename = `${hashedFileName}${ext}`;
      const fileBuffer = file.buffer;
      const filePath = `${categoryName}/${user.id}/${filename}`;

      console.log('checked');

      await new Promise<void>((resolve, reject) => {
        this.client.putObject(
          baseBucket,
          filePath,
          fileBuffer,
          fileBuffer.length,
          metaData,
          (err) => {
            if (err) {
              console.log(err.message);
              return reject(
                new HttpException(err.message, HttpStatus.BAD_REQUEST),
              );
            }
            resolve();
          },
        );
      });

      uploadedUrls.push(
        `http://localhost:9000/${this.configService.get('MINIO_BUCKET')}/${filePath}`,
      );
    }
    return uploadedUrls;
  }
}
