import { AllowedFilmFilterFields } from '@modules/films/enums';
import { FilterUtil } from '@lib/src';

export const FILTER_CONFIG_FOR_FILM = {
  [AllowedFilmFilterFields.ID]: {
    transform: (value: string) => ({
      equals: value,
    }),
  },
  [AllowedFilmFilterFields.TITLE]: {
    transform: (value: string) => ({
      contains: value,
      mode: 'insensitive',
    }),
  },
  [AllowedFilmFilterFields.DIRECTOR]: {
    transform: (value: string) => {
      if (value.includes(',')) {
        const directors = value.split(',').map((d) => d.trim());
        return {
          in: directors,
        };
      }
      return {
        contains: value,
        mode: 'insensitive',
      };
    },
  },
  [AllowedFilmFilterFields.GENRE]: {
    transform: (value: string) => {
      return FilterUtil.getConfigForArray(value);
    },
  },
  [AllowedFilmFilterFields.ESTIMATION]: {
    transform: (value: string) => {
      return FilterUtil.getConfigForNumber(value, 'gte');
    },
  },
  [AllowedFilmFilterFields.REVIEWS]: {
    transform: (value: string) => {
      if (value) {
        return {
          none: {
            userId: value,
          },
        };
      }
      return {};
    },
  },
};
