import { apiDocSum, apiOperationDoc, apiRequesDoc, apiResponseDoc } from 'src/lib/doc/decorators/doc.decorator';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { CODE } from 'src/constants/code';
import { RefreshDto } from '../dto/refresh.dto';
import { LogoutDto } from '../dto/logout.dto';

export function RegisterPost(): MethodDecorator {
  return apiDocSum(
    apiRequesDoc({
      summary: '사용자 생성',
      dto: RegisterDto,
      sample: {
        email: '메일을 입력해주세요',
        password: '비밀번호를 입력해주세요',
      },
    }),
    apiResponseDoc(CODE.BAD_REQUEST),
  );
}

export function LoginPost(): MethodDecorator {
  return apiDocSum(
    apiRequesDoc({
      summary: '사용자 로그인',
      dto: LoginDto,
      sample: {
        email: 'email',
        password: '1234',
      },
    }),
    apiResponseDoc(CODE.UNAUTHORIZED),
  );
}

export function RefreshPut(): MethodDecorator {
  return apiDocSum(
    apiRequesDoc({
      summary: 'JWT 토큰 재발급',
      dto: RefreshDto,
      sample: {
        email: 'email',
        refreshToken:
          'refreshToken',
      },
    }),
    apiResponseDoc(CODE.INTERNAL_SERVER_ERROR),
  );
}

export function LogoutDelete(): MethodDecorator {
  return apiDocSum(
    apiRequesDoc({
      summary: '로그아웃',
      dto: LogoutDto,
      sample: {
        email: 'email',
      },
    }),
  );
}
