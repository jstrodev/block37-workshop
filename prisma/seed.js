const { PrismaClient } = require("@prisma/client");
const { faker } = require("@faker-js/faker");

const prisma = new PrismaClient();

const seed = async () => {
  // Clear existing data
  await prisma.playlist.deleteMany();
  await prisma.track.deleteMany();
  await prisma.user.deleteMany();

  // Create 5 users
  const users = await prisma.user.createMany({
    data: Array(5)
      .fill(null)
      .map(() => ({
        username: faker.person.fullName(),
      })),
  });

  // Create 20 tracks
  const tracks = await prisma.track.createMany({
    data: Array(20)
      .fill(null)
      .map(() => ({
        name: `${faker.music.songName()} - ${faker.music.artist()}`,
      })),
  });

  // Get all created records
  const allUsers = await prisma.user.findMany();
  const allTracks = await prisma.track.findMany();

  // Create 10 playlists
  for (let i = 0; i < 10; i++) {
    const numTracks = Math.floor(Math.random() * 8) + 3;
    const randomTracks = faker.helpers.arrayElements(allTracks, numTracks);

    await prisma.playlist.create({
      data: {
        name: faker.music.genre() + " Mix",
        description: faker.lorem.sentence(),
        ownerId: faker.helpers.arrayElement(allUsers).id,
        tracks: {
          connect: randomTracks.map((track) => ({ id: track.id })),
        },
      },
    });
  }

  console.log("Database has been seeded! 🌱");
};

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
