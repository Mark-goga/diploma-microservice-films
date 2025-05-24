import { AllowedReviewFilterFields } from '@modules/review/enums';
import { FilterUtil } from '@lib/src';

export const FILTER_CONFIG_FOR_REVIEW = {
  [AllowedReviewFilterFields.ID]: {
    transform: (value: string) => ({
      equals: value,
    }),
  },
  [AllowedReviewFilterFields.USER_ID]: {
    transform: (value: string) => ({
      equals: value,
    }),
  },
  [AllowedReviewFilterFields.FILM_ID]: {
    transform: (value: string) => ({
      equals: value,
    }),
  },
  [AllowedReviewFilterFields.RATING]: {
    transform: (value: string) => {
      return FilterUtil.getConfigForNumber(value, 'gte');
    },
  },
  [AllowedReviewFilterFields.TITLE]: {
    transform: (value: string) => ({
      contains: value,
      mode: 'insensitive',
    }),
  },
  [AllowedReviewFilterFields.DESCRIPTION]: {
    transform: (value: string) => ({
      contains: value,
      mode: 'insensitive',
    }),
  },
};
