import { FilterDto } from '@proto/common/common';
import { FilterConfig, FilterUtil } from '@lib/src';

export class FilterFilmUtils {
  static buildFilmPrismaWhere<T extends object>(
    filters?: Array<FilterDto>,
    config?: FilterConfig,
  ) {
    if (!filters || filters.length === 0) {
      return {};
    }
    const genreFilter = filters.find((filter) => filter.field === 'genre');
    const directorFilter = filters.find(
      (filter) => filter.field === 'director',
    );
    const otherFilters = filters.filter(
      (filter) => filter.field !== 'genre' && filter.field !== 'director',
    );
    if (genreFilter && directorFilter && config) {
      const genreCondition = config['genre'].transform(genreFilter.value);
      const directorCondition = config['director'].transform(
        directorFilter.value,
      );

      const otherConditions = FilterUtil.buildPrismaWhere(otherFilters, config);

      return {
        OR: [
          {
            genre: genreCondition,
            director: directorCondition,
            ...otherConditions,
          },
          {
            genre: genreCondition,
            ...otherConditions,
          },
        ],
      } as T;
    } else {
      return FilterUtil.buildPrismaWhere(filters, config);
    }
  }
}
