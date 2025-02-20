import { Body, Controller, Delete, Post, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { User } from '../entities/users.entity';
import { ResponseEntity } from '../lib/response/response-entity';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { LogoutDto } from './dto/logout.dto';
import { ApiTags } from '@nestjs/swagger';
import { LoginPost, LogoutDelete, RefreshPut, RegisterPost } from './doc/auth.doc';

@ApiTags('Login')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @RegisterPost()
  @Post('/register')
  async register(@Body() registerDto: RegisterDto): Promise<ResponseEntity<User>> {
    const response = await this.authService.register(registerDto);

    return ResponseEntity.OK(response);
  }

  @LoginPost()
  @Post('/login')
  async login(@Body() loginDto: LoginDto): Promise<ResponseEntity<LoginDto>> {
    const response = await this.authService.login(loginDto);

    return ResponseEntity.OK(response);
  }

  @RefreshPut()
  @Put('/refresh')
  async refresh(@Body() refreshDto: RefreshDto): Promise<ResponseEntity<RefreshDto>> {
    const response = await this.authService.refresh(refreshDto);

    return ResponseEntity.OK(response);
  }

  @LogoutDelete()
  @Delete('/logout')
  async logout(@Body() logoutDto: LogoutDto): Promise<any> {
    await this.authService.logout(logoutDto.email);

    return ResponseEntity.OK();
  }
}
