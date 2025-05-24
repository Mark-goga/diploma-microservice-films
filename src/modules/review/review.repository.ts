import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from '@modules/review/dto';
import { PrismaService } from '@common/database/prisma/prisma.service';
import { Prisma, Reviews } from '@prisma/client';
import { SkipAndLimit } from '@lib/src';

@Injectable()
export class ReviewRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createReviewDto: CreateReviewDto,
    userId: string,
  ): Promise<Reviews> {
    return this.prismaService.reviews.create({
      data: {
        ...createReviewDto,
        userId,
      },
    });
  }

  async findMany(
    pagination: SkipAndLimit,
    where?: Prisma.ReviewsWhereInput,
    orderBy?: Prisma.ReviewsOrderByWithRelationInput,
  ): Promise<Reviews[]> {
    return this.prismaService.reviews.findMany({
      take: pagination.limit,
      skip: pagination.skip,
      where,
      orderBy,
    });
  }

  async count(where?: Prisma.ReviewsWhereInput): Promise<number> {
    return this.prismaService.reviews.count({ where });
  }

  async findByIdOrThrow(id: string) {
    return this.prismaService.reviews.findUnique({
      where: { id },
    });
  }

  async findReviewsByFilmId(filmId: string): Promise<Reviews[]> {
    return this.prismaService.reviews.findMany({
      where: { filmId },
    });
  }

  async update(id: string, data: Partial<Reviews>): Promise<Reviews> {
    return this.prismaService.reviews.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prismaService.reviews.delete({
      where: { id },
    });
  }
}
