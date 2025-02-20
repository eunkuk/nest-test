import { Injectable } from '@nestjs/common';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Exam } from '../entities/exam.entity';
import { EntityManager, Repository } from 'typeorm';
import { ApiException } from '../lib/exception/api-exception';
import { CODE } from '../constants/code';
import { MailerService } from 'src/mailer/mailer.service';
import { join } from 'path';
import * as fs from 'fs';
import { CustomHttpService } from '../http/http.module';
import { RssParserService } from '../parser/rss-parser.service';
import { WebCrawlerService } from '../parser/web-crawler.service';
import { PageOptionDto } from 'src/lib/paginations/page-option.dto';
import { Pagination } from 'src/lib/paginations/pagination';
import { PaginationBuilder } from 'src/lib/paginations/pagination-builder';

@Injectable()
export class ExamService {
  constructor(
    @InjectRepository(Exam)
    private readonly examRepository: Repository<Exam>,
    private readonly mailerService: MailerService,
    private readonly rssParserService: RssParserService,
    private readonly webCrawlerService: WebCrawlerService,
  ) {}

  async findAll(): Promise<Exam[]> {
    try {
      return await this.examRepository.find();
    } catch (e) {
      // 에러 처리 로직 추가 가능
      throw new ApiException(CODE.INTERNAL_SERVER_ERROR, 'Failed to find exams');
    }
  }

  async findOne(id: number) {
    try {
      return await this.examRepository.findOne({ where: { id: id } });
    } catch (e) {
      // 에러 처리 로직 추가 가능
      throw new ApiException(CODE.INTERNAL_SERVER_ERROR, 'Failed to find exams');
    }
  }

  async create(createExamDto: CreateExamDto): Promise<Exam> {
    // memory 객체 생성
    const exam = this.examRepository.create(createExamDto);
    // 실제 commit
    return await this.examRepository.save(exam);
  }

  async update(id: number, updateExamDto: UpdateExamDto): Promise<Exam> {
    const exam = await this.examRepository.findOne({ where: { id: id } });
    if (!exam) {
      throw new ApiException(CODE.INTERNAL_SERVER_ERROR, `Exam with id ${id} not found`);
    }

    Object.assign(exam, updateExamDto);
    return await this.examRepository.save(exam);
  }

  async remove(id: number): Promise<Exam> {
    const exam = await this.examRepository.findOne({ where: { id: id } });
    if (!exam) {
      throw new ApiException(CODE.INTERNAL_SERVER_ERROR, `Exam with id ${id} not found`);
    }

    exam.is_delete = 'T';
    return await this.examRepository.save(exam);
  }

  async removeQueryBuilder(id: number): Promise<Exam> {
    const exam = await this.examRepository.findOne({ where: { id: id } });
    if (!exam) {
      throw new ApiException(CODE.INTERNAL_SERVER_ERROR, `Exam with id ${id} not found`);
    }

    return await this.examRepository.manager.transaction(async (transactionalEntityManager: EntityManager) => {
      await transactionalEntityManager.createQueryBuilder().update(Exam).set({ is_delete: 'T' }).whereInIds(id).execute();

      return await transactionalEntityManager.findOne(Exam, { where: { id: id } });
    });
  }

  async sendUserWelcomeEmail(email: string): Promise<void> {
    const filePath = join(__dirname, '..', '/templates/mail-sample-form.hbs');
    const template = fs.readFileSync(filePath, 'utf8');
    const form = {
      template,
      bindItem: { name: email, exp1: 'exp1', exp2: 'exp2' },
      receivers: [email],
      subject: 'Welcome',
      sender: 'email',
    };

    return await this.mailerService.sendEmail(form);
  }

  async findExamList(pageOptionDto: PageOptionDto): Promise<Pagination<Exam>> {
    const builder = this.examRepository.createQueryBuilder('exam');
    // query builder ++
    return new PaginationBuilder(builder, pageOptionDto).build();
  }

  async parserRss(url: string) {
    let rssServiceTest = await this.rssParserService.parseRssFeed(url);

    const result = [];
    for (let i = 0; i < rssServiceTest.length; i++) {
      const temp = {
        title: rssServiceTest[i].title,
        link: rssServiceTest[i].link,
      };

      result.push(temp);
    }

    return result;
  }

  async crawlWebpage(url: string, target: string) {
    let parserServiceTest = await this.webCrawlerService.crawlWebpage(url, target);

    return parserServiceTest;
  }
}
