import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class IgnoreFaviconMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.originalUrl === '/favicon.ico') {
      res.status(204).end(); // No Content 상태 코드로 응답
    } else {
      next();
    }
  }
}
