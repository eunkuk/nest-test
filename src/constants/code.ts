import { HttpStatus } from '@nestjs/common';

export interface IStatus {
  status: HttpStatus;
  code: string;
  msg: string;
}

export const CODE = {
  // 성공 응답
  OK: { status: HttpStatus.OK, code: 'G0000', msg: '요청이 성공적으로 처리되었습니다.' },
  CREATED: { status: HttpStatus.CREATED, code: 'G0001', msg: '새로운 리소스가 성공적으로 생성되었습니다.' },

  // 클라이언트 오류 응답
  BAD_REQUEST: { status: HttpStatus.BAD_REQUEST, code: 'C4000', msg: '요청을 처리할 수 없습니다. 입력 내용을 확인해 주세요.' },
  UNAUTHORIZED: { status: HttpStatus.UNAUTHORIZED, code: 'C4010', msg: '인증이 필요합니다. 로그인 후 다시 시도해 주세요.' },
  FORBIDDEN: { status: HttpStatus.FORBIDDEN, code: 'C4030', msg: '해당 리소스에 대한 접근 권한이 없습니다.' },
  NOT_FOUND: { status: HttpStatus.NOT_FOUND, code: 'C4040', msg: '요청하신 리소스를 찾을 수 없습니다.' },
  METHOD_NOT_ALLOWED: { status: HttpStatus.METHOD_NOT_ALLOWED, code: 'C4050', msg: '해당 요청 방식은 지원되지 않습니다.' },
  CONFLICT: { status: HttpStatus.CONFLICT, code: 'C4090', msg: '요청이 현재 서버의 상태와 충돌합니다.' },
  UNPROCESSABLE_ENTITY: { status: HttpStatus.UNPROCESSABLE_ENTITY, code: 'C4220', msg: '요청은 유효하나 처리할 수 없습니다. 입력 내용을 다시 확인해 주세요.' },
  INTERNAL_TIMEOUT: { status: HttpStatus.REQUEST_TIMEOUT, code: 'C4080', msg: '요청 시간이 초과되었습니다. 다시 시도해 주세요.' },
  TOKEN_EXPIRED: { status: HttpStatus.UNAUTHORIZED, code: 'C4011', msg: '토큰이 만료되었습니다.' },
  INVALID_TOKEN: { status: HttpStatus.UNAUTHORIZED, code: 'C4012', msg: '유효하지 않은 토큰입니다.' },

  // 서버 오류 응답
  INTERNAL_SERVER_ERROR: { status: HttpStatus.INTERNAL_SERVER_ERROR, code: 'S5000', msg: '서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' },
  NOT_IMPLEMENTED: { status: HttpStatus.NOT_IMPLEMENTED, code: 'S5010', msg: '해당 기능은 아직 구현되지 않았습니다.' },
  BAD_GATEWAY: { status: HttpStatus.BAD_GATEWAY, code: 'S5020', msg: '게이트웨이 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' },
  SERVICE_UNAVAILABLE: { status: HttpStatus.SERVICE_UNAVAILABLE, code: 'S5030', msg: '현재 서비스를 이용할 수 없습니다. 잠시 후 다시 시도해 주세요.' },
  NO_RESPONSE: { status: HttpStatus.BAD_GATEWAY, code: 'S5021', msg: '서버로부터 응답을 받지 못했습니다. 잠시 후 다시 시도해 주세요.' },
  REQUEST_SETUP_ERROR: { status: HttpStatus.INTERNAL_SERVER_ERROR, code: 'S5001', msg: '요청 설정 중 오류가 발생했습니다.' },
  UNKNOWN_ERROR: { status: HttpStatus.INTERNAL_SERVER_ERROR, code: 'S5002', msg: '알 수 없는 오류가 발생했습니다.' },
  EXTERNAL_TIMEOUT: { status: HttpStatus.REQUEST_TIMEOUT, code: 'S4080', msg: '외부 요청 시간이 초과되었습니다. 다시 시도해 주세요.' },
  IO_ERROR: { status: HttpStatus.INTERNAL_SERVER_ERROR, code: 'S6000', msg: '입출력 처리 중 오류가 발생했습니다.' },
};
