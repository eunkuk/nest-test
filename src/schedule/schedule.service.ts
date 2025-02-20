import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ScheduleService {
  private readonly logger = new Logger(ScheduleService.name);

  constructor() {}

  @Cron('* * * * * *')
  everySecond() {
    // this.logger.log('매초 실행');
  }

  @Cron('0 * * * * *')
  everyMinute() {
    // this.logger.log('매분 실행');
  }

  @Cron('0 0 * * * *')
  everyHour() {
    // this.logger.log('정시 실행');
  }
}
