import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { ExamService } from './exam.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { ResponseEntity } from '../lib/response/response-entity';
import { Exam } from '../entities/exam.entity';
import { AuthGuard } from '../guards/auth.guards';
import { ApiTags } from '@nestjs/swagger';
import { ExamAuthGet, ExamAuthIdDelete, ExamAuthIdGet, ExamAuthIdPut, ExamAuthPost } from './doc/exam.auth.doc';

@ApiTags('Exam-Auth')
@UseGuards(AuthGuard)
@Controller('exam-auth/')
export class ExamAuthController {
  constructor(private readonly examService: ExamService) {}

  @ExamAuthPost()
  @Post()
  async create(@Body() createExamDto: CreateExamDto) {
    const response = await this.examService.create(createExamDto);

    return ResponseEntity.OK(response);
  }

  @ExamAuthGet()
  @Get()
  async findAll(): Promise<ResponseEntity<Exam[]>> {
    let response = await this.examService.findAll();

    return ResponseEntity.OK(response);
  }

  @ExamAuthIdGet()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ResponseEntity<Exam>> {
    let response = await this.examService.findOne(+id);

    return ResponseEntity.OK(response);
  }

  @ExamAuthIdPut()
  @Put('/:id')
  async update(@Param('id') id: string, @Body() updateExamDto: UpdateExamDto) {
    let response = await this.examService.update(+id, updateExamDto);

    return ResponseEntity.OK(response);
  }

  @ExamAuthIdDelete()
  @Delete('/:id')
  async remove(@Param('id') id: string) {
    let response = await this.examService.remove(+id);

    return ResponseEntity.OK(response);
  }
}
