import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoggedinUserDto } from './dto/loggedin-user.dto';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenPayloadInterface } from './interfaces/tokenPayload.interface';
import { EmailService } from '../email/email.service';
import { CACHE_MANAGER } from '@nestjs/common/cache';
import { Cache } from 'cache-manager';
import { EmailVerificationDto } from '../user/dto/email-verification.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const newUser = await this.userService.createUser(createUserDto);
    newUser.password = undefined;
    return newUser;
  }

  async logInUser(loggedinUserDto: LoggedinUserDto) {
    console.log(loggedinUserDto);
    const user = await this.userService.getUserBy(
      'email',
      loggedinUserDto.email,
    );

    console.log(user);
    const isPassswordMatched = await bcrypt.compare(
      loggedinUserDto.password,
      user.password,
    );
    if (!isPassswordMatched) {
      throw new HttpException(
        'password does not match',
        HttpStatus.BAD_REQUEST,
      );
    }
    return user;
  }

  public generateAccessToken(userId: string) {
    const payload: TokenPayloadInterface = { userId };

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESSTOKEN_SECRET'),
      expiresIn: `${this.configService.get('JWT_ACCESSTOKEN_EXPIRATION_TIME')}`,
    });

    // return token;
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_ACCESSTOKEN_EXPIRATION_TIME')}`;
  }

  public generateRefreshToken(userId: string) {
    const payload: TokenPayloadInterface = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESHTOKEN_SECRET'),
      expiresIn: `${this.configService.get('JWT_REFRESHTOKEN_EXPIRATION_TIME')}`,
    });

    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_REFRESHTOKEN_EXPIRATION_TIME')}`;
    return { cookie, token };
  }

  public getCookiesForLogout() {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ];
  }

  // async sendEmailTest(email: string) {
  //   await this.emailService.sendMail({
  //     to: email,
  //     subject: 'check email test',
  //     text: 'The confirmation number is as follows',
  //   });
  //   return 'please check your email';
  // }

  async initEmailVerification(email: string) {
    const generateNo = this.generateOTP();
    await this.cacheManager.set(email, generateNo);

    await this.emailService.sendMail({
      to: email,
      subject: 'check email test',
      text: `The confirmation number is as follows. ${generateNo}`,
    });
    return 'please check your email';
  }

  async confirmEmailVerification(emailVerificationDto: EmailVerificationDto) {
    const { email, code } = emailVerificationDto;
    const codeFromRedis = await this.cacheManager.get(email);
    if (codeFromRedis !== code) {
      throw new BadRequestException('Wrong code provided');
    }
    await this.cacheManager.del(email);
    return 'success';
  }

  generateOTP() {
    let OTP = '';

    for (let i = 1; i <= 6; i++) {
      OTP += Math.floor(Math.random() * 10);
    }
    return OTP;
  }
}
