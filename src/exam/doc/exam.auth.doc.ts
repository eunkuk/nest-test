import { apiDocSum, apiGuardDoc, apiRequesDoc } from 'src/lib/doc/decorators/doc.decorator';
import { CreateExamDto } from '../dto/create-exam.dto';
import { UpdateExamDto } from '../dto/update-exam.dto';

export function ExamAuthPost(): MethodDecorator {
  return apiDocSum(
    apiRequesDoc({
      summary: 'exam 생성',
      description: 'exam을 생성합니다.',
      dto: CreateExamDto,
      sample: {
        name: 'name',
      },
    }),
    apiGuardDoc(),
  );
}

export function ExamAuthGet(): MethodDecorator {
  return apiDocSum(
    apiRequesDoc({
      summary: 'exam 전체조회',
      description: 'exam 전체를 조회합니다.',
    }),
    apiGuardDoc(),
  );
}

export function ExamAuthIdGet(): MethodDecorator {
  return apiDocSum(
    apiRequesDoc({
      summary: 'exam 단일조회',
      description: 'exam 단일을 조회합니다.',
    }),
    apiGuardDoc(),
  );
}

export function ExamAuthIdPut(): MethodDecorator {
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
    apiGuardDoc(),
  );
}

export function ExamAuthIdDelete(): MethodDecorator {
  return apiDocSum(
    apiRequesDoc({
      summary: 'exam 삭제',
      description: '특정 exam을 삭제합니다.',
    }),
    apiGuardDoc(),
  );
}
