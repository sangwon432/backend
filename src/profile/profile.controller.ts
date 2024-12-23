import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Put,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { RequestWithUserInterface } from '../auth/interfaces/requestWithUser.interface';
import { Profile } from './entities/profile.entity';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  async createProfile(
    @Req() req: RequestWithUserInterface,
    @Body() createProfileDto: CreateProfileDto,
  ): Promise<Profile> {
    console.log('req.user:', req.user);
    return await this.profileService.createProfile(req.user, createProfileDto);
  }

  @UseGuards(AccessTokenGuard)
  @Put()
  async updateProfile(
    @Req() req: RequestWithUserInterface,
    @Body() updateProfileDto: CreateProfileDto,
  ) {
    return await this.profileService.updateProfile(req.user, updateProfileDto);
  }
}
