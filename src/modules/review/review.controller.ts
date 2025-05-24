import { Controller, UseGuards } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { ReviewService } from './review.service';
import { AuthGuard } from '@lib/src/guards';
import {
  CreateReviewDto,
  GetReviewsDto,
  UpdateReviewDto,
} from '@modules/review/dto';
import { FindOneDocumentValidator } from '@lib/src';
import { ReviewServiceControllerMethods } from '@proto/review/review';
import { getCurrentUser } from '@lib/src/decorators';
import { User } from '@proto/user/user';

@Controller()
@ReviewServiceControllerMethods()
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UseGuards(AuthGuard)
  createReview(
    @Payload() createReviewDto: CreateReviewDto,
    @getCurrentUser() user: User,
  ) {
    return this.reviewService.create(createReviewDto, user);
  }

  findManyReviews(@Payload() getReviewsDto: GetReviewsDto) {
    return this.reviewService.findMany(getReviewsDto);
  }

  findOneReview(@Payload() findOneUserDto: FindOneDocumentValidator) {
    return this.reviewService.findOne(findOneUserDto.id);
  }

  findReviewsByFilm(@Payload() filmId: string) {
    return this.reviewService.findByFilmId(filmId);
  }

  @UseGuards(AuthGuard)
  updateReview(@Payload() updateReviewDto: UpdateReviewDto) {
    return this.reviewService.update(updateReviewDto);
  }

  @UseGuards(AuthGuard)
  removeReview(@Payload() findOneUserDto: FindOneDocumentValidator) {
    return this.reviewService.remove(findOneUserDto.id);
  }
}
