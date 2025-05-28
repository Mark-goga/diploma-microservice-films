import { Injectable } from '@nestjs/common';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { FilmsRepository } from './films.repository';
import { GetFilmsDto } from './dto/get-films.dto';
import { PaginationUtil, SortForPrismaUtil } from '@lib/src';
import { Prisma } from '@prisma/client';
import { FILTER_CONFIG_FOR_FILM } from '@modules/films/constants/films-filter.constants';
import { FilterFilmUtils } from '@modules/films/utils/filter-film.utils';
import { AllowedFilmFilterFields } from '@modules/films/enums';

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

    const where = FilterFilmUtils.buildFilmPrismaWhere<Prisma.FilmsWhereInput>(
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

    const authorsField = options.filters?.find(
      (f) => f.field === AllowedFilmFilterFields.DIRECTOR,
    );
    const authorsFilter = authorsField ? authorsField.value : [];

    if (authorsFilter.length) {
      films.sort((a, b) => {
        const aDirectorMatch = authorsFilter.includes(a.director) ? 0 : 1;
        const bDirectorMatch = authorsFilter.includes(b.director) ? 0 : 1;

        return aDirectorMatch - bDirectorMatch;
      });
    }

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
    const { reviews, ...film } = await this.filmsRepository.findByIdOrThrow(id);
    return {
      film,
      reviews,
    };
  }

  async update(updateFilmDto: UpdateFilmDto) {
    const { id, ...data } = updateFilmDto;
    return await this.filmsRepository.update(id, data);
  }

  async remove(id: string) {
    return await this.filmsRepository.remove(id);
  }
}
