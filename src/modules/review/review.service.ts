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
}
