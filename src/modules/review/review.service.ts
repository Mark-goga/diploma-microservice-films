import { Injectable } from '@nestjs/common';
import { ReviewRepository } from './review.repository';
import { FilterUtil, PaginationUtil, SortForPrismaUtil } from '@lib/src';
import { Prisma } from '@prisma/client';
import { FILTER_CONFIG_FOR_REVIEW } from '@modules/review/constants/review-filter.constants';
import {
  CreateReviewDto,
  GetReviewsDto,
  UpdateReviewDto,
} from '@modules/review/dto';
import { User } from '@proto/user/user';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { ERROR_MESSAGES } from '@common/constants';
import { AllowedFilmFilterFields } from '@modules/films/enums';

@Injectable()
export class ReviewService {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  async create(createReviewDto: CreateReviewDto, user: User) {
    return await this.reviewRepository.create(createReviewDto, user.id);
  }

  async findMany(options: GetReviewsDto) {
    const pagination = PaginationUtil.getSkipAndLimit({
      ...options.pagination,
    });

    const where = FilterUtil.buildPrismaWhere<Prisma.ReviewsWhereInput>(
      options.filters,
      FILTER_CONFIG_FOR_REVIEW,
    );

    const sort =
      SortForPrismaUtil.sortForPrisma<Prisma.ReviewsOrderByWithRelationInput>(
        options.sorting,
      );

    const [reviews, totalCount] = await Promise.all([
      this.reviewRepository.findMany(pagination, where, sort),
      this.reviewRepository.count(where),
    ]);

    const paginationMeta = PaginationUtil.getMeta(
      options.pagination.page,
      pagination.limit,
      totalCount,
    );

    return {
      reviews,
      pagination: { ...paginationMeta },
    };
  }

  async findOne(id: string) {
    return this.reviewRepository.findByIdOrThrow(id);
  }

  async findByFilmId(filmId: string) {
    return this.reviewRepository.findReviewsByFilmId(filmId);
  }

  async update(updateReviewDto: UpdateReviewDto) {
    const { id, ...data } = updateReviewDto;
    return this.reviewRepository.update(id, data);
  }

  async remove(id: string) {
    return this.reviewRepository.remove(id);
  }

  async findByUserId(userId: string) {
    const reviewsWithFilms = await this.reviewRepository.findByUserId(userId);
    return {
      reviews: reviewsWithFilms,
    };
  }

  async getPersonalFiltersForFilms(userId: string) {
    const reviewsWithFilms = await this.reviewRepository.findByUserId(userId);

    if (!reviewsWithFilms.length) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: ERROR_MESSAGES.USER_DONT_HAVE_REVIEWS,
      });
    }
    const sumRatings = reviewsWithFilms.reduce((acc, review) => {
      return (acc += review.rating);
    }, 0);
    const averageRating = sumRatings / reviewsWithFilms.length;

    const sortedReviewsByRating = reviewsWithFilms
      .sort((a, b) => {
        return b.rating - a.rating;
      })
      .slice(0, 5);

    const topReviewsByRating = sortedReviewsByRating.reduce((acc, review) => {
      if (review.rating >= averageRating) {
        acc.push(review);
      }
      return acc;
    }, []);

    const genresCount: Record<string, number> = {};
    const directorsCount: Record<string, number> = {};

    topReviewsByRating.forEach((review) => {
      if (review.film) {
        review.film.genre.forEach((genre) => {
          genresCount[genre] = (genresCount[genre] || 0) + review.rating;
        });

        directorsCount[review.film.director] =
          (directorsCount[review.film.director] || 0) + review.rating;
      }
    });

    const sortedGenres = Object.entries(genresCount)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 3)
      .map(([genre]) => genre);

    const sortedDirectors = Object.entries(directorsCount)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 3)
      .map(([director]) => director);

    const filters = [
      ...(sortedGenres.length
        ? [
            {
              field: AllowedFilmFilterFields.GENRE,
              value: sortedGenres.join(','),
            },
          ]
        : []),
      ...(sortedDirectors.length
        ? [
            {
              field: AllowedFilmFilterFields.DIRECTOR,
              value: sortedDirectors.join(','),
            },
          ]
        : []),
      {
        field: AllowedFilmFilterFields.REVIEWS,
        value: userId,
      },
    ];

    return {
      filters,
    };
  }
}
