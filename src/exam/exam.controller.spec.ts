import { Test, TestingModule } from '@nestjs/testing';
import { ExamController } from './exam.controller';
import { ExamService } from './exam.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { ResponseEntity } from '../lib/response/response-entity';

describe('ExamController', () => {
  let controller: ExamController;
  let service: ExamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExamController],
      providers: [
        {
          provide: ExamService,
          useValue: {
            create: jest.fn().mockResolvedValue({}),
            findAll: jest.fn().mockResolvedValue([{}]),
            findOne: jest.fn().mockResolvedValue({}),
            update: jest.fn().mockResolvedValue({}),
            remove: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    controller = module.get<ExamController>(ExamController);
    service = module.get<ExamService>(ExamService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an exam', async () => {
    const createExamDto: CreateExamDto = { name: 'test3123' };
    const result = await controller.create(createExamDto);
    expect(result).toEqual({});
    expect(service.create).toHaveBeenCalledWith(createExamDto);
  });

  it('should return all exams', async () => {
    const result = await controller.findAll();
    expect(result).toEqual(ResponseEntity.OK([{}]));
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return one exam', async () => {
    const id = '1';
    const result = await controller.findOne(id);
    expect(result).toEqual(ResponseEntity.OK({}));
    expect(service.findOne).toHaveBeenCalledWith(+id);
  });

  it('should update an exam', async () => {
    const id = '1';
    const updateExamDto: UpdateExamDto = { name: 'test', is_delete: 'T' };
    const result = await controller.update(id, updateExamDto);
    expect(result).toEqual(ResponseEntity.OK({}));
    expect(service.update).toHaveBeenCalledWith(+id, updateExamDto);
  });

  it('should delete an exam', async () => {
    const id = '1';
    const result = await controller.remove(id);
    expect(result).toEqual(ResponseEntity.OK({}));
    expect(service.remove).toHaveBeenCalledWith(+id);
  });
});
