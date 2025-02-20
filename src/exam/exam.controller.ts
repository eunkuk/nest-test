import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ExamService } from './exam.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { ResponseEntity } from '../lib/response/response-entity';
import { Exam } from '../entities/exam.entity';
import { PageOptionDto } from 'src/lib/paginations/page-option.dto';
import { Pagination } from 'src/lib/paginations/pagination';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import {
  ExamGet,
  ExamIdDelete,
  ExamIdGet,
  ExamIdPut,
  ExamMailSendPost,
  ExamPaginationGet,
  ExamPost,
  ExamStatusCodeGet,
} from './doc/exam.doc';
import { EmailDto } from './dto/mail-exam.dto';
import { CODE } from 'src/constants/code';

@ApiTags('Exam')
@Controller('exam')
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @ExamPost()
  @Post()
  async create(@Body() createExamDto: CreateExamDto) {
    const response = await this.examService.create(createExamDto);

    return ResponseEntity.OK(response);
  }

  @ExamGet()
  @Get()
  async findAll(): Promise<ResponseEntity<Exam[]>> {
    let response = await this.examService.findAll();

    return ResponseEntity.OK(response);
  }

  @ExamIdGet()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ResponseEntity<Exam>> {
    let response = await this.examService.findOne(+id);

    return ResponseEntity.OK(response);
  }

  @ExamIdPut()
  @Put('/:id')
  async update(@Param('id') id: string, @Body() updateExamDto: UpdateExamDto) {
    let response = await this.examService.update(+id, updateExamDto);

    return ResponseEntity.OK(response);
  }

  @ExamIdDelete()
  @Delete('/:id')
  async remove(@Param('id') id: string) {
    let response = await this.examService.remove(+id);

    return ResponseEntity.OK(response);
  }

  @ExamMailSendPost()
  @Post('/mail/send')
  async sendMail(@Body() emailDto: EmailDto): Promise<ResponseEntity<void>> {
    const response = await this.examService.sendUserWelcomeEmail(emailDto.email);

    return ResponseEntity.OK(response);
  }

  @ApiExcludeEndpoint()
  @Post('/parser/rss')
  async parserRss(@Body('url') url: string): Promise<ResponseEntity<any>> {
    const response = await this.examService.parserRss(url);

    return ResponseEntity.OK(response);
  }

  @ApiExcludeEndpoint()
  @Post('/parser/web')
  async parserWeb(@Body('url') url: string, @Body('target') target: string): Promise<ResponseEntity<any>> {
    const response = await this.examService.crawlWebpage(url, target);

    return ResponseEntity.OK(response);
  }

  @ExamPaginationGet()
  @Get('/page/list')
  async findExamList(@Query() pageOptionsDto: PageOptionDto): Promise<ResponseEntity<Pagination<Exam>>> {
    let response = await this.examService.findExamList(pageOptionsDto);
    return ResponseEntity.OK(response);
  }

  @ExamStatusCodeGet()
  @Get('/status/code')
  async getStatusCode(): Promise<ResponseEntity<any>> {
    return ResponseEntity.OK(CODE);
  }
}
