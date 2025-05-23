import {
  AllowedFilmFilterFields,
  AllowedFilmSortingFields,
} from '@modules/films/enums';
import { CreateFindManyDtoValidator } from '@lib/src';

export class GetFilmsDto extends CreateFindManyDtoValidator(
  AllowedFilmSortingFields,
  AllowedFilmFilterFields,
) {}
