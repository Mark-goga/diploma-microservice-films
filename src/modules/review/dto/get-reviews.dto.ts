import { CreateFindManyDtoValidator } from '@lib/src';
import {
  AllowedReviewFilterFields,
  AllowedReviewSortingFields,
} from '@modules/review/enums';

export class GetReviewsDto extends CreateFindManyDtoValidator(
  AllowedReviewSortingFields,
  AllowedReviewFilterFields,
) {}
