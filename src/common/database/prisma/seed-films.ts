import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import { CONFIG } from '../../constants';

const prisma = new PrismaClient();
const TMDB_API_KEY = CONFIG.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p';

const genreMap: Record<number, string> = {};

async function getGenreMap() {
  const res = await axios.get(`${TMDB_BASE_URL}/genre/movie/list`, {
    params: { api_key: TMDB_API_KEY },
  });

  for (const genre of res.data.genres) {
    genreMap[genre.id] = genre.name;
  }
}

async function getDirector(movieId: number): Promise<string> {
  const res = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}/credits`, {
    params: { api_key: TMDB_API_KEY },
  });

  const director = res.data.crew.find(
    (person: any) => person.job === 'Director',
  );
  return director?.name || 'Unknown';
}

async function fetchFilms() {
  await getGenreMap();
  const allFilms = [];

  for (let page = 1; page <= 1; page++) {
    const res = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
      params: { api_key: TMDB_API_KEY, page },
    });

    allFilms.push(...res.data.results);
  }

  return allFilms.slice(0, 100);
}

function mapGenres(ids: number[]): string[] {
  return ids.map((id) => genreMap[id]).filter(Boolean);
}

async function insertFilms(films: any[]) {
  for (const film of films) {
    const director = await getDirector(film.id);
    const genre = mapGenres(film.genre_ids);

    await prisma.films.upsert({
      where: { id: film.id.toString() },
      update: {},
      create: {
        id: film.id.toString(),
        title: film.title,
        description: film.overview || 'No description',
        director,
        releaseDate: new Date(film.release_date),
        estimation: film.vote_average,
        genre: genre || ['Unknown'],
        backGroundImageKey: `${IMAGE_BASE}/original${film.backdrop_path}`,
        avatarImageKey: `${IMAGE_BASE}/w200${film.poster_path}`,
      },
    });
  }
}

export const seedFilms = async () => {
  const films = await fetchFilms();
  await insertFilms(films);
  await prisma.$disconnect();
};
