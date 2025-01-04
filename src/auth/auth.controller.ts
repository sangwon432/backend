import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { RequestWithUserInterface } from './interfaces/requestWithUser.interface';
import { AccessTokenGuard } from './guards/access-token.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { EmailVerificationDto } from '../user/dto/email-verification.dto';
import { UserService } from '../user/user.service';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LoggedinUserDto } from './dto/loggedin-user.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('/signup')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.authService.createUser(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ApiBody({
    type: LoggedinUserDto,
  })
  async loggedInUser(@Req() req: RequestWithUserInterface) {
    // const user = await this.authService.logInUser(loggedinUserDto);
    // const token = await this.authService.generateAccessToken(user.id);
    // return { user, token };
    const { user } = req;
    // console.log(user);
    // const token = await this.authService.generateAccessToken(user.id);
    // return { user, token };
    const accessCookie = await this.authService.generateAccessToken(user.id);
    const { cookie: refreshCookie, token: refreshToken } =
      await this.authService.generateRefreshToken(user.id);

    console.log('ACCESS COOKIE +++++++++++++++', accessCookie);
    console.log('REFRESH TOKEN +++++++++++++++', refreshToken);

    await this.userService.setCurrentRefreshTokenToRedis(refreshToken, user.id);

    req.res.setHeader('Set-Cookie', [accessCookie, refreshCookie]);
    return user;
  }

  @UseGuards(AccessTokenGuard)
  @Post('/logout')
  async logout(@Req() req: RequestWithUserInterface) {
    console.log('logout called');
    await this.userService.removeRefreshTokenFromRedis(req.user.id);
    req.res.setHeader('Set-Cookie', this.authService.getCookiesForLogout());
    return true;
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  async getUserInfo(@Req() req: RequestWithUserInterface) {
    return await req.user;
  }

  @Post('/email/test')
  async sendEmailTest(@Body('email') email: string) {
    // return await this.authService.sendEmailTest(email);
    return await this.authService.initEmailVerification(email);
    // console.log(email);
  }

  @Post('/email/check')
  async checkEmail(@Body() emailVerificationDto: EmailVerificationDto) {
    return await this.authService.confirmEmailVerification(
      emailVerificationDto,
    );
  }

  @UseGuards(RefreshTokenGuard)
  @Get('/refresh')
  async refresh(@Req() req: RequestWithUserInterface) {
    const accessCookie = await this.authService.generateAccessToken(
      req.user.id,
    );
    req.res.setHeader('Set-Cookie', accessCookie);
    return req.user;
  }
}
