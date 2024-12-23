import {
  Body,
  Controller,
  Put,
  Req,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { RequestWithUserInterface } from '../auth/interfaces/requestWithUser.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { BufferedFile } from '../minio-client/file.model';
import { Profile } from 'passport';
import { UpdateResult } from 'typeorm';

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
