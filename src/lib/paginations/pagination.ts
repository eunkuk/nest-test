import { IsArray } from 'class-validator';
import { PageOptionDto } from './page-option.dto';
import { ApiException } from '../exception/api-exception';
import { CODE } from 'src/constants/code';

export class Pagination<T> {
  @IsArray()
  list: T[];

  meta: {
    page: number;
    take: number;
    totalCount: number;
    totalPage: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };

  constructor(list: T[], totalCount: number, pageOptionDto: PageOptionDto) {
    const totalPage = Math.ceil(totalCount / pageOptionDto.take);
    if (pageOptionDto.page < 1 || pageOptionDto.page > totalPage) {
      throw new ApiException(
        CODE.BAD_REQUEST,
        `페이지 번호(${pageOptionDto.page})가 유효 범위를 벗어났습니다. 최대 페이지: ${totalPage}.`,
      );
    }

    this.list = list;
    this.meta = {
      page: pageOptionDto.page,
      take: pageOptionDto.take,
      totalCount: totalCount,
      totalPage: totalPage,
      hasPreviousPage: pageOptionDto.page > 1,
      hasNextPage: pageOptionDto.page < Math.ceil(totalCount / pageOptionDto.take),
    };
  }
}
