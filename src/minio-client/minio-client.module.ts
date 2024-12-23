import { Module } from '@nestjs/common';
import { MinioClientService } from './minio-client.service';
import { MinioModule } from 'nestjs-minio-client';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    MinioModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (cfg: ConfigService) => ({
        endPoint: cfg.get('MINIO_ENDPOINT'),
        port: cfg.get('MINIO_PORT'),
        useSSL: false,
        accessKey: cfg.get('MINIO_ACCESS_KEY'),
        secret: cfg.get('MINIO_SECRET_KEY'),
      }),
    }),
  ],
  providers: [MinioClientService],
  exports: [MinioClientService],
})
export class MinioClientModule {}
