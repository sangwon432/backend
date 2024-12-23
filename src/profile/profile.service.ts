import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from '../user/entities/user.entity';
import { Profile } from './entities/profile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    private readonly userService: UserService,
  ) {}
  async createProfile(
    user: User,
    createProfileDto: CreateProfileDto,
  ): Promise<Profile> {
    const newProfile = await this.profileRepository.create({
      ...createProfileDto,
      user,
    });

    // console.log('profile service new profile', newProfile.user.profile);
    // newProfile.user.profile = newProfile;

    const savedProfile = await this.profileRepository.save(newProfile);
    await this.userService.updateUserInfo(user, savedProfile);
    return newProfile;
  }

  async updateProfile(user: User, updateProfileDto?: CreateProfileDto) {
    return await this.profileRepository.update(user.profile.id, {
      ...updateProfileDto,
    });
  }
}
