import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { ApiException } from '../lib/exception/api-exception';
import { CODE } from '../constants/code';
import { AllConfigType } from '../config/config.type';
import { RedisService } from '../redis/redis.service';
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService<AllConfigType>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
      const secret = this.configService.get('auth.secret', { infer: true });

      if (!token) {
        throw new ApiException(CODE.UNAUTHORIZED);
      }

      let payload: { email: any; user: any };

      try {
        payload = await this.jwtService.verifyAsync(token, { secret: secret });
      } catch (jwtError) {
        if (jwtError.name === 'TokenExpiredError') {
          throw new ApiException(CODE.TOKEN_EXPIRED);
        }
        throw new ApiException(CODE.INVALID_TOKEN);
      }

      if (!payload) {
        throw new ApiException(CODE.UNAUTHORIZED);
      }

      // 블랙리스트 확인
      const isBlacklisted = await this.redisService.get(`blacklist:${payload.email}`);
      if (isBlacklisted) {
        throw new ApiException(CODE.UNAUTHORIZED);
      }
      request['user'] = payload.user;
    } catch (error) {
      this.logger.error(error);
      if (error instanceof ApiException) {
        throw error;
      }
      throw new ApiException(CODE.INTERNAL_SERVER_ERROR);
    }
    return true;
  }
}
