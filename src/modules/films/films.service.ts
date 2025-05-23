import { Injectable } from '@nestjs/common';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { FilmsRepository } from './films.repository';
import { GetFilmsDto } from './dto/get-films.dto';
import { FilterUtil, PaginationUtil, SortForPrismaUtil } from '@lib/src';
import { Prisma } from '@prisma/client';
import { FILTER_CONFIG_FOR_FILM } from '@modules/films/constants/films-filter.constants';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async create(createFilmDto: CreateFilmDto) {
    return this.filmsRepository.create(createFilmDto);
  }

  async findAll(options: GetFilmsDto) {
    const pagination = PaginationUtil.getSkipAndLimit({
      ...options.pagination,
    });

    const where = FilterUtil.buildPrismaWhere<Prisma.FilmsWhereInput>(
      options.filters,
      FILTER_CONFIG_FOR_FILM,
    );

    const sort =
      SortForPrismaUtil.sortForPrisma<Prisma.FilmsOrderByWithRelationInput>(
        options.sorting,
      );

    const [films, totalCount] = await Promise.all([
      this.filmsRepository.findAll(pagination, where, sort),
      this.filmsRepository.count(where),
    ]);

    const paginationMeta = PaginationUtil.getMeta(
      options.pagination.page,
      pagination.limit,
      totalCount,
    );
    return {
      films,
      pagination: { ...paginationMeta },
    };
  }

  async findOne(id: string) {
    return await this.filmsRepository.findByIdOrThrow(id);
  }

  async update(updateFilmDto: UpdateFilmDto) {
    const { id, ...data } = updateFilmDto;
    return await this.filmsRepository.update(id, data);
  }

  async remove(id: string) {
    return await this.filmsRepository.remove(id);
  }
}
