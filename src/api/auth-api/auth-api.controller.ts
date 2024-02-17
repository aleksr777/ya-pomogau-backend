import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { VkLoginDto } from './dto/vk-login.dto';
import { AuthService } from '../../core/auth/auth.service';
import { VKNewUserDto } from './dto/vk-new.dto';
import { UsersService } from '../../core/users/users.service';
import { Public } from '../../common/decorators/public.decorator';
import { AdminLoginAuthGuard } from '../../common/guards/local-auth.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

type mockLoginDto = {
  vkId: string;
};

@Controller('auth')
export class AuthApiController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  @Public()
  @Post('vk')
  async vkLogin(@Body() dto: VkLoginDto) {
    return this.authService.loginVK(dto);
  }

  @Public()
  @Post('new')
  async register(@Body() dto: VKNewUserDto) {
    const user = await this.usersService.createUser(dto);
    if (user) {
      const token = await this.authService.authenticate(user);
      return { token, user };
    }
    throw new InternalServerErrorException('Ошибка создания пользователя');
  }

  @Public()
  @UseGuards(AdminLoginAuthGuard)
  @Post('administrative')
  async administrative(@Req() req: Express.Request) {
    if (req.user) {
      // TODO: Вынести в сервис в core после решения проблемы с типизацией Users
      const token = await this.authService.authenticate(req.user as Record<string, unknown>);
      return { token, user: req.user };
    }
    throw new UnauthorizedException('Неверное имя пользователя или пароль');
  }

  @Public()
  @Post('mock')
  public async mockLogin(@Body() dto: mockLoginDto) {
    const { vkId: mockId } = dto;
    const user = await this.usersService.checkVKCredential(mockId);
    if (user) {
      // TODO: Вынести в сервис в core после решения проблемы с типизацией Users
      const token = await this.authService.authenticate(user as Record<string, unknown>);
      return { token, user };
    }
    throw new UnauthorizedException('Неверное имя пользователя или пароль');
  }

  @UseGuards(JwtAuthGuard)
  @Get('token')
  public async checkToken(@Req() req: Express.Request) {
    return req.user;
  }
}
