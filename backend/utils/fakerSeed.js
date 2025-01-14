import { faker } from '@faker-js/faker';
import { initDb, getDb } from '../models/index.js';
import { createFilm } from '../models/filmModel.js';

(async () => {
  try {
    // Initialize the database
    await initDb();
    const db = getDb();

    // Insert sample films
    for (let i = 0; i < 5; i++) {
      await createFilm({
        title: faker.lorem.words(3),
        description: faker.lorem.sentence(),
        genre: faker.helpers.arrayElement(['Horror', 'Komedia', 'Akcja', 'Thriller']),
        duration: faker.number.int({ min: 60, max: 180 }), // Correct function for generating a random integer
        posterUrl: faker.image.url({ width: 200, height: 300, category: 'movie', randomize: true }), // Updated function
        trailerUrl: 'https://www.youtube.com/watch?v=XXXX', // Sample link
      });
    }

    console.log('Fake data inserted.');
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
})();
