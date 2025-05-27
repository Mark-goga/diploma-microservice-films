import { Controller, UseGuards } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { FilmsService } from './films.service';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { GetFilmsDto } from './dto/get-films.dto';
import { RoleName, Roles, TokenTypeDecorator } from '@lib/src/decorators';
import { AuthGuard } from '@lib/src/guards';
import { TokenType } from '@proto/auth/auth';
import { RolesGuard } from '@lib/src/guards/roles.guard';
import { FilmServiceControllerMethods } from '@proto/films/films';
import { FindOneDocumentDto } from '@proto/common/common';

@Controller()
@FilmServiceControllerMethods()
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Roles(RoleName.ADMIN)
  @TokenTypeDecorator(TokenType.REFRESH)
  @UseGuards(AuthGuard, RolesGuard)
  createFilm(@Payload() createFilmDto: CreateFilmDto) {
    return this.filmsService.create(createFilmDto);
  }

  findAll(@Payload() getFilmsDto: GetFilmsDto) {
    return this.filmsService.findAll(getFilmsDto);
  }

  findOne(@Payload() findOneDto: FindOneDocumentDto) {
    return this.filmsService.findOne(findOneDto.id);
  }

  @Roles(RoleName.ADMIN)
  @TokenTypeDecorator(TokenType.REFRESH)
  @UseGuards(AuthGuard, RolesGuard)
  update(@Payload() updateFilmDto: UpdateFilmDto) {
    return this.filmsService.update(updateFilmDto);
  }

  @Roles(RoleName.ADMIN)
  @TokenTypeDecorator(TokenType.REFRESH)
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Payload() findOneDto: FindOneDocumentDto) {
    return this.filmsService.remove(findOneDto.id);
  }
}
