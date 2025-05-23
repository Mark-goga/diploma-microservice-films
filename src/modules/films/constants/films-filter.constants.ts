import { AllowedFilmFilterFields } from '@modules/films/enums';

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
    transform: (value: string) => ({
      contains: value,
      mode: 'insensitive',
    }),
  },
  [AllowedFilmFilterFields.GENRE]: {
    transform: (value: string) => ({
      contains: value,
      mode: 'insensitive',
    }),
  },
};
