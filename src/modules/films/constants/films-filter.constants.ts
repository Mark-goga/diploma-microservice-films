import { AllowedFilmFilterFields } from '@modules/films/enums';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { FilterUtil, GENERAL_ERROR_MESSAGES } from '@lib/src';
import { ERROR_MESSAGES } from '@common/constants';

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
    transform: (value: string) => {
      return FilterUtil.getConfigForArray(value);
    },
  },
  [AllowedFilmFilterFields.ESTIMATION]: {
    transform: (value: string) => {
      const parsedValue = parseFloat(value);
      if (isNaN(parsedValue)) {
        throw new RpcException({
          code: status.INVALID_ARGUMENT,
          details: ERROR_MESSAGES.INVALID_ESTIMATION,
          message: GENERAL_ERROR_MESSAGES.VALIDATION_ERROR,
        });
      }
      return {
        equals: parsedValue,
      };
    },
  },
};
