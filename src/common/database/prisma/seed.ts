import { PrismaClient } from '@prisma/client';
import { seedFilms } from './seed-films';

const prisma = new PrismaClient();

const main = async () => {
  const filmCount = await prisma.films.count();
  if (filmCount === 0) {
    await seedFilms();
  }

  await seedReviews();
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

async function seedReviews() {
  const filmIds = ['950387', '574475', '1480799', '1197306', '1241436'];
  const newFilmIds = [
    '552524',
    '1094473',
    '1092073',
    '986056',
    '1233069',
    '897160',
    '1144430',
    '1359977',
    '324544',
    '1180763',
    '896536',
    '822119',
    '1233413',
  ];
  const baseUuid = '5100d2fc-82a2-4e18-99c4-046d0111aaed';
  const userIds = [
    baseUuid.replace('aaed', 'aae1'),
    baseUuid.replace('aaed', 'aae2'),
    baseUuid.replace('aaed', 'aae3'),
    baseUuid.replace('aaed', 'aae4'),
    baseUuid.replace('aaed', 'aae5'),
    baseUuid.replace('aaed', 'aaad'),
  ];

  const reviews = [
    {
      title: 'Absolutely loved it!',
      description:
        'This film exceeded all my expectations. The cinematography was stunning and the acting performances were outstanding. Would definitely recommend to everyone!',
      rating: 5,
      filmId: filmIds[0],
      userId: userIds[0],
    },
    {
      title: 'Great storyline, impressive execution',
      description:
        'The concept was brilliant and the execution matched it. The pacing was perfect and kept me engaged throughout. The characters were well developed.',
      rating: 4,
      filmId: filmIds[1],
      userId: userIds[1],
    },
    {
      title: 'Mixed feelings about this one',
      description:
        'There were some really good moments in the film, but also parts that felt unnecessary. The lead actor was great, but the supporting cast was hit and miss.',
      rating: 3,
      filmId: filmIds[2],
      userId: userIds[2],
    },
    {
      title: 'Surprising twist ending',
      description:
        'I did not see that coming! The film starts slow but builds to an incredible finale. The director really knows how to create suspense.',
      rating: 4,
      filmId: filmIds[3],
      userId: userIds[3],
    },
    {
      title: 'Visually stunning but lacks depth',
      description:
        'Beautiful cinematography and special effects, but the story lacks emotional depth. Characters felt one-dimensional despite a talented cast.',
      rating: 3,
      filmId: filmIds[4],
      userId: userIds[4],
    },
    {
      title: 'An instant classic',
      description:
        'This film will be remembered for years to come. Perfect balance of humor, drama, and action with memorable performances throughout.',
      rating: 5,
      filmId: filmIds[0],
      userId: userIds[0],
    },
    {
      title: 'Mediocre at best',
      description:
        'Had potential but fell short in execution. The dialogue was awkward at times and the plot seemed to meander without purpose.',
      rating: 2,
      filmId: filmIds[1],
      userId: userIds[1],
    },
    {
      title: 'Disappointing experience',
      description:
        "Was really looking forward to this one but it didn't deliver. The story was predictable and the acting felt forced. Not worth the runtime.",
      rating: 1,
      filmId: filmIds[2],
      userId: userIds[2],
    },
    // New reviews for the last user (aaad)
    {
      title: 'Heartwarming and nostalgic',
      description:
        'Lilo & Stitch captured my heart all over again. The blend of Hawaiian culture, family values, and that adorable blue alien makes for a perfect movie night. The animation still holds up wonderfully after all these years!',
      rating: 10,
      filmId: newFilmIds[0],
      userId: userIds[5],
    },
    {
      title: 'A timeless classic reimagined',
      description:
        'This new take on Bambi brings the emotional depth of the original to a new generation. The forest scenes are breathtaking and the loss of Bambi\ns mother still hits just as hard. A beautiful reflection on life and nature.',
      rating: 4,
      filmId: newFilmIds[1],
      userId: userIds[5],
    },
    {
      title: 'Genuinely terrifying',
      description:
        'The Haunting at Saint Joseph\ns had me on the edge of my seat the entire time. The intersection of faith and horror creates a uniquely unsettling atmosphere. Not for the faint of heart, but horror fans will appreciate the creativity.',
      rating: 8,
      filmId: newFilmIds[2],
      userId: userIds[5],
    },
    {
      title: 'Unexpected depth for a superhero film',
      description:
        'Thunderbolts surprised me with its character development and moral complexity. These aren\nt your typical heroes, and that\ns what makes it special. The action sequences were impressive while still keeping the focus on the characters journeys.',
      rating: 7,
      filmId: newFilmIds[3],
      userId: userIds[5],
    },
    {
      title: 'Tense political thriller that falls short',
      description:
        'Exterritorial starts with a promising premise but gets tangled in its own plot. The lead actress delivers a powerful performance, but the script doesn\nt give her enough to work with. The conspiracy reveals felt predictable by the end.',
      rating: 2,
      filmId: newFilmIds[4],
      userId: userIds[5],
    },
    {
      title: 'Fresh take on the vigilante genre',
      description:
        'Brave Citizen offers something different in the crowded superhero landscape. The school setting provides a unique backdrop, and the social commentary on bullying and corruption adds meaningful depth. Great fight choreography too!',
      rating: 5,
      filmId: newFilmIds[5],
      userId: userIds[5],
    },
    {
      title: 'Adrenaline-fueled finale',
      description:
        'Last Bullet delivers exactly what it promises - high-octane action and satisfying closure to the trilogy. The car sequences are incredible, though the plot is somewhat predictable. Pure entertainment for action movie fans.',
      rating: 6,
      filmId: newFilmIds[6],
      userId: userIds[5],
    },
    {
      title: 'Derivative horror that fails to scare',
      description:
        'Conjuring the Cult relies too heavily on familiar horror tropes without adding anything new to the genre. The cult aspects had potential but were underdeveloped. Some decent performances can\nt save a mediocre script.',
      rating: 3,
      filmId: newFilmIds[7],
      userId: userIds[5],
    },
    {
      title: 'Ambitious fantasy epic',
      description:
        'In the Lost Lands creates a fascinating world with its own mythology and rules. The chemistry between the leads carries the film through some slower moments, and the creature designs are genuinely unique. A solid adventure that deserves more attention.',
      rating: 4,
      filmId: newFilmIds[8],
      userId: userIds[5],
    },
    {
      title: 'Frustratingly generic',
      description:
        'From the Shadows had all the ingredients for an effective paranormal thriller but fails to use them in an interesting way. The investigation unfolds predictably, and the supposed twist can be seen from a mile away. Disappointing execution.',
      rating: 2,
      filmId: newFilmIds[9],
      userId: userIds[5],
    },
    {
      title: 'Visually stunning folktale',
      description:
        'The Legend of Ochi feels like discovering an ancient fable for the first time. The rural setting is gorgeously realized, and the relationship between Yuri and the baby ochi is touching. A beautiful film that speaks to the importance of empathy and understanding.',
      rating: 9,
      filmId: newFilmIds[10],
      userId: userIds[5],
    },
    {
      title: 'Captain America rises to the occasion',
      description:
        'Brave New World successfully passes the shield to Sam Wilson with a politically charged thriller that feels relevant. The action sequences are top-notch, and the film isn\nt afraid to comment on real-world issues. A strong entry in the MCU.',
      rating: 4,
      filmId: newFilmIds[11],
      userId: userIds[5],
    },
    {
      title: 'Coogler\ns vision shines through',
      description:
        'Sinners is a dark, provocative tale that showcases Ryan Coogler\ns talent for character-driven narratives. The twin brothers relationship is compelling, and the town itself becomes a character with its own secrets. A haunting meditation on guilt and redemption.',
      rating: 5,
      filmId: newFilmIds[12],
      userId: userIds[5],
    },
  ];

  for (const review of reviews) {
    await prisma.reviews.create({
      data: review,
    });
  }

  console.log(`Seeded ${reviews.length} reviews successfully`);
}
