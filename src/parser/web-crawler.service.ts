import { Injectable, Logger } from '@nestjs/common';
import * as cheerio from 'cheerio';
import { CustomHttpService } from '../http/http.module';
import { ApiException } from '../lib/exception/api-exception';
import { CODE } from '../constants/code';

@Injectable()
export class WebCrawlerService {
  private readonly logger = new Logger(WebCrawlerService.name);

  constructor(private customHttpService: CustomHttpService) {}

  async crawlWebpage(url: string, selector: string) {
    try {
      const response = await this.customHttpService.get(url);
      const $ = cheerio.load(response.data);
      const result = $(selector)
        .map((i, el) => $(el).text().trim())
        .get();

      this.logger.log(`Webpage crawled successfully from ${url}`);
      return result;
    } catch (error) {
      this.logger.error(`crawler error: ${error.message}`);
      throw new ApiException(CODE.INTERNAL_SERVER_ERROR, error.message);
    }
  }
}
