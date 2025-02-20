import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exam } from '../entities/exam.entity';
import { User } from '../entities/users.entity';
import { Config } from '../entities/config.entity';

@Module({
  // entity가 추가되어야 된다.
  imports: [TypeOrmModule.forFeature([Exam, User, Config])],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
