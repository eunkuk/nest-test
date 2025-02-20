import { Inject, Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../entities/users.entity';
import { RegisterDto } from './dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiException } from '../lib/exception/api-exception';
import { CODE } from '../constants/code';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../config/config.type';
import { RedisService } from '../redis/redis.service';
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService<AllConfigType>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    try {
      const existingUser = await this.userRepository.findOne({ where: { email: registerDto.email } });
      if (existingUser) {
        throw new ApiException(CODE.BAD_REQUEST, '해당 Email은 이미 사용 중입니다.');
      }

      // password 암호화
      registerDto.password = await bcrypt.hash(registerDto.password, 10);

      const user = this.userRepository.create(registerDto);
      // default roles
      user.roles = 'user';

      return await this.userRepository.save(user);
    } catch (error) {
      if (error instanceof ApiException) {
        throw error;
      } else {
        this.logger.error(error);
        throw new ApiException(CODE.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async login(loginDto: LoginDto): Promise<LoginDto> {
    try {
      const user = await this.userRepository.findOne({ where: { email: loginDto.email } });

      if (!user) {
        throw new ApiException(CODE.UNAUTHORIZED);
        // throw new ApiException(CODE.BAD_REQUEST, '로그인 정보를 확인해주세요.');
      }

      // password 비교
      const match = await bcrypt.compare(loginDto.password, user.password);

      if (!match) {
        throw new ApiException(CODE.UNAUTHORIZED);
        // throw new ApiException(CODE.BAD_REQUEST, '로그인 정보를 확인해주세요.');
      }

      // token 생성
      const { accessToken, refreshToken, refreshExpires } = this.createToken(user);

      loginDto.password = '';
      loginDto.accessToken = accessToken;
      loginDto.refreshToken = refreshToken;

      // Redis에 refresh token 저장
      await this.redisService.setWithTTL(`refreshToken:${user.email}`, refreshToken, refreshExpires); // 1주일

      return loginDto;
    } catch (error) {
      if (error instanceof ApiException) {
        throw error;
      } else {
        this.logger.error(error);
        throw new ApiException(CODE.INTERNAL_SERVER_ERROR);
      }
    }
  }

  private createToken(user: User): { accessToken: string; refreshToken: string; refreshExpires: string } {
    const secret = this.configService.get('auth.secret', { infer: true });
    const refreshSecret = this.configService.get('auth.refreshSecret', { infer: true });
    const secretExpires = this.configService.get('auth.expires', { infer: true });
    const refreshExpires = this.configService.get('auth.refreshExpires', { infer: true });

    const payload = { email: user.email, role: user.roles };
    const accessToken = this.jwtService.sign(payload, { secret: secret, expiresIn: secretExpires });
    const refreshToken = this.jwtService.sign(payload, { secret: refreshSecret, expiresIn: refreshExpires });
    return { accessToken, refreshToken, refreshExpires };
  }

  async refresh(refreshDto: RefreshDto): Promise<RefreshDto> {
    try {
      const refreshSecret = this.configService.get('auth.refreshSecret', { infer: true });

      let payload: { email: any };

      try {
        payload = await this.jwtService.verifyAsync(refreshDto.refreshToken, { secret: refreshSecret });
      } catch (jwtError) {
        if (jwtError.name === 'TokenExpiredError') {
          throw new ApiException(CODE.TOKEN_EXPIRED);
        }
        throw new ApiException(CODE.INVALID_TOKEN);
      }

      const tokenId = payload.email;

      const storedToken = await this.redisService.get(`refreshToken:${tokenId}`);
      if (storedToken !== refreshDto.refreshToken) {
        throw new ApiException(CODE.UNAUTHORIZED);
      }

      if (refreshDto.email !== tokenId) {
        throw new ApiException(CODE.UNAUTHORIZED);
      }

      const user = await this.userRepository.findOne({ where: { email: refreshDto.email } });

      if (!user) {
        throw new ApiException(CODE.UNAUTHORIZED);
      }

      const { accessToken, refreshToken, refreshExpires } = this.createToken(user);

      // Redis에 새로운 refresh token 저장
      await this.redisService.setWithTTL(`refreshToken:${user.email}`, refreshToken, refreshExpires);

      let result = {
        email: '',
        accessToken: '',
        refreshToken: '',
      };

      result.email = refreshDto.email;
      result.accessToken = accessToken;
      result.refreshToken = refreshToken;

      return result;
    } catch (error) {
      this.logger.error(error);
      if (error instanceof ApiException) {
        throw error;
      }
      throw new ApiException(CODE.INTERNAL_SERVER_ERROR);
    }
  }

  // 로그아웃 메서드 추가
  async logout(email: string): Promise<void> {
    try {
      const key = `refreshToken:${email}`;
      await this.redisService.del(key);

      // 액세스 토큰 블랙리스트에 추가 (만료 시간은 토큰의 원래 만료 시간과 일치해야 함)
      const accessTokenExp = 3600; // 1시간 (설정에 따라 조정 필요)
      await this.redisService.setWithTTL(`blacklist:${email}`, 'true', accessTokenExp);
    } catch (error) {
      if (error instanceof ApiException) {
        throw error;
      } else {
        this.logger.error(error);
        throw new ApiException(CODE.INTERNAL_SERVER_ERROR);
      }
    }
  }
}
