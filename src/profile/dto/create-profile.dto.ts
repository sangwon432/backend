import { Education } from '../../common/enums/education.enum';
import { Gender } from '../../common/enums/gender.enum';

export class CreateProfileDto {
  addressFirstLine: string;
  addressSecondLine: string;
  occupation: string;
  education: Education;
  birthDate: Date;
  height: number;
  gender: Gender;
}
