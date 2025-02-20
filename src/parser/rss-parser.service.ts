import { Injectable, Logger } from '@nestjs/common';
import * as Parser from 'rss-parser';
import { CustomHttpService } from '../http/http.module';
import { ApiException } from '../lib/exception/api-exception';
import { CODE } from '../constants/code';

@Injectable()
export class RssParserService {
  private readonly rssParser: Parser;
  private readonly logger = new Logger(RssParserService.name);

  constructor(private customHttpService: CustomHttpService) {
    this.rssParser = new Parser();
  }

  async parseRssFeed(url: string): Promise<any> {
    try {
      const response = await this.customHttpService.get(url);
      const feed = await this.rssParser.parseString(response.data);
      this.logger.log(`RSS feed parsed successfully from ${url}`);
      return feed.items;
    } catch (error) {
      this.logger.error(`RSS parsing error: ${error.message}`);
      throw new ApiException(CODE.INTERNAL_SERVER_ERROR, error.message);
    }
  }
}
