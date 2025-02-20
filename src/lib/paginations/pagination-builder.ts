import { PageOptionDto } from './page-option.dto';
import { SelectQueryBuilder } from 'typeorm';
import { Pagination } from './pagination';
import { ApiException } from '../exception/api-exception';
import { CODE } from 'src/constants/code';

export class PaginationBuilder<T> {
  private builder: SelectQueryBuilder<T>;
  private pageOptionDto: PageOptionDto;

  constructor(builder: SelectQueryBuilder<T>, pageOptionDto: PageOptionDto) {
    this.builder = builder;
    this.pageOptionDto = pageOptionDto;
  }

  async build(): Promise<Pagination<T>> {
    if (this.pageOptionDto.page < 1 || this.pageOptionDto.take < 1) {
      throw new ApiException(CODE.BAD_REQUEST, '페이지와 가져오기 값은 양수여야 합니다');
    }

    // sort options object
    const sortOptions = {};
    this.pageOptionDto.sort?.forEach((sort) => {
      sortOptions[sort.field] = sort.by?.toUpperCase() || 'ASC';
    });

    // query builder
    this.builder.setFindOptions({
      order: sortOptions,
      skip: this.pageOptionDto.take * (this.pageOptionDto.page - 1),
      take: this.pageOptionDto.take,
    });

    // return result with pagination
    const [list, totalCount] = await this.builder.getManyAndCount();
    return new Pagination(list, totalCount, this.pageOptionDto);
  }
}
