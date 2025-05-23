import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/database/prisma/prisma.service';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { Prisma } from '@prisma/client';
import { SkipAndLimit } from '@lib/src';

@Injectable()
export class FilmsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createFilmDto: CreateFilmDto) {
    return this.prismaService.films.create({
      data: {
        ...createFilmDto,
      },
    });
  }

  async findAll(
    paginationOptions: SkipAndLimit,
    where?: Prisma.FilmsWhereInput,
    sort?: Prisma.FilmsOrderByWithRelationInput,
  ) {
    return this.prismaService.films.findMany({
      take: paginationOptions.limit,
      skip: paginationOptions.skip,
      where,
      orderBy: sort,
    });
  }

  async findByIdOrThrow(id: string) {
    return this.prismaService.films.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        reviews: true,
      },
    });
  }

  async update(id: string, updateFilmDto: Omit<UpdateFilmDto, 'id'>) {
    return this.prismaService.films.update({
      where: {
        id,
      },
      data: {
        ...updateFilmDto,
      },
    });
  }

  async remove(id: string) {
    return this.prismaService.films.delete({
      where: {
        id,
      },
    });
  }

  async count(where: Prisma.FilmsWhereInput = {}) {
    return this.prismaService.films.count({ where });
  }
}
