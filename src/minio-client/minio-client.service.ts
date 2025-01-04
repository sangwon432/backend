import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { ConfigService } from '@nestjs/config';
import { User } from '../user/entities/user.entity';
import { BufferedFile } from './file.model';
import * as crypto from 'crypto';
import { Product } from '../product/entities/product.entity';

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

      if (files.indexOf(file) === 0) {
        await this.deleteFolderContents(
          baseBucket,
          `${categoryName}/${user.id}/`,
        );
      }

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

  public async uploadProductImgs(
    product: Product,
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
      const filePath = `${categoryName}/${product.id}/${filename}`;

      console.log('checked');

      if (files.indexOf(file) === 0) {
        await this.deleteFolderContents(
          baseBucket,
          `${categoryName}/${product.id}/`,
        );
      }

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

  public async deleteFolderContents(
    bucketName: string,
    folderPath: string,
  ): Promise<void> {
    const objectList: string[] = [];

    try {
      const stream = this.client.listObjects(bucketName, folderPath, true);
      for await (const obj of stream) {
        objectList.push(obj.name);
      }

      if (objectList.length > 0) {
        await this.client.removeObjects(bucketName, objectList);
        console.log('Deleted objects:', objectList);
      } else {
        console.log('Folder path is empty:', folderPath);
      }
    } catch (err) {
      console.error(err);
      throw new HttpException(
        'Error deleting folder contents',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
