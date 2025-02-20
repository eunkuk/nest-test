import { apiDocSum, apiRequesDoc } from 'src/lib/doc/decorators/doc.decorator';
import { CreateExamDto } from '../dto/create-exam.dto';
import { UpdateExamDto } from '../dto/update-exam.dto';
import { EmailDto } from '../dto/mail-exam.dto';

export function ExamPost(): MethodDecorator {
  return apiDocSum(
    apiRequesDoc({
      summary: 'exam 생성',
      description: 'exam을 생성합니다.',
      dto: CreateExamDto,
      sample: {
        name: 'name',
      },
    }),
  );
}

export function ExamGet(): MethodDecorator {
  return apiDocSum(
    apiRequesDoc({
      summary: 'exam 전체조회',
      description: 'exam 전체를 조회합니다.',
    }),
  );
}

export function ExamIdGet(): MethodDecorator {
  return apiDocSum(
    apiRequesDoc({
      summary: 'exam 단일조회',
      description: 'exam 단일을 조회합니다.',
    }),
  );
}

export function ExamIdPut(): MethodDecorator {
  return apiDocSum(
    apiRequesDoc({
      summary: 'exam 수정',
      description: '특정 exam을 수정합니다.',
      dto: UpdateExamDto,
      sample: {
        email: 'email',
        is_delete: 'F',
      },
    }),
  );
}

export function ExamIdDelete(): MethodDecorator {
  return apiDocSum(
    apiRequesDoc({
      summary: 'exam 삭제',
      description: '특정 exam을 삭제합니다.',
    }),
  );
}

export function ExamMailSendPost(): MethodDecorator {
  return apiDocSum(
    apiRequesDoc({
      summary: 'email 전송',
      description: 'email을 전송합니다.',
      dto: EmailDto,
      sample: {
        email: 'email',
      },
    }),
  );
}

export function ExamPaginationGet(): MethodDecorator {
  return apiDocSum(
    apiRequesDoc({
      summary: 'exam 페이징 조회',
      description: 'exam을 페이징 조회합니다.',
    }),
  );
}

export function ExamStatusCodeGet(): MethodDecorator {
  return apiDocSum(
    apiRequesDoc({
      summary: '상태코드 조회',
      description: '상태코드를 조회합니다.',
    }),
  );
}
