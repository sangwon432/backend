import {
  Body,
  Controller,
  Put,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { RequestWithUserInterface } from '../auth/interfaces/requestWithUser.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { BufferedFile } from '../minio-client/file.model';
import { UpdateResult } from 'typeorm';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put('/profile')
  @UseGuards(AccessTokenGuard)
  async updateProfile(
    @Req() req: RequestWithUserInterface,
    @Body() updateUserDto: CreateUserDto,
  ) {
    return await this.userService.updateProfile(req.user.id, updateUserDto);
  }

  @Put()
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FilesInterceptor('profileImgs'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'multiple image files with additional user data',
    schema: {
      type: 'object',
      properties: {
        profileImgs: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
            description: 'profile image file',
          },
        },
        username: {
          type: 'string',
          description: 'username of the user',
          example: 'johnd',
        },
        email: {
          type: 'string',
          description: 'email of the user',
          example: 'john@example.com',
        },
      },
      required: [], // set all fields to optional
    },
  })
  async updateUserInfo(
    @Req() req: RequestWithUserInterface,
    @UploadedFiles() profileImgs?: BufferedFile[],
    @Body() updateUserDto?: CreateUserDto,
  ): Promise<UpdateResult> {
    return await this.userService.updateUserInfo(
      req.user,
      profileImgs,
      updateUserDto,
    );
  }
}
