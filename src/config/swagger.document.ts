import { DocumentBuilder } from '@nestjs/swagger';

export class BaseAPIDoc {
  public builder = new DocumentBuilder();

  public initializeOptions() {
    return this.builder
      .setTitle('Sangwon Fullstack')
      .setDescription('Sangwon Fullstack API Document')
      .setVersion('1.0')
      .build();
  }
}
