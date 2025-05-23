import { PrismaClient } from '@prisma/client';
import { seedFilms } from '@database/prisma/seed-films';

const prisma = new PrismaClient();

const main = async () => {
  const filmCount = await prisma.films.count();
  if (filmCount === 0) {
    await seedFilms();
  }
};

main()
  .then(async () => {
    console.log('Seeding completed successfully');
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error('Error during seeding:', error);
    await prisma.$disconnect();
    process.exit(1);
  });
