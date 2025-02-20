import { Module } from '@nestjs/common';
import { RssParserService } from './rss-parser.service';
import { WebCrawlerService } from './web-crawler.service';

@Module({
  providers: [RssParserService, WebCrawlerService],
  exports: [RssParserService, WebCrawlerService],
})
export class ExternalParserModule {}
