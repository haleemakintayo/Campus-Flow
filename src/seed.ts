import { db } from './firebase';
import { setDoc, doc } from 'firebase/firestore';
import { MOCK_BUSES, MOCK_ROUTES } from './constants';

export async function seedDatabase() {
  console.log('Seeding database...');
  
  try {
    // Seed Routes
    for (const route of MOCK_ROUTES) {
      await setDoc(doc(db, 'routes', route.id), route);
      console.log(`Seeded route: ${route.name}`);
    }

    // Seed Buses
    for (const bus of MOCK_BUSES) {
      await setDoc(doc(db, 'buses', bus.id), bus);
      console.log(`Seeded bus: ${bus.name}`);
    }

    console.log('Database seeding complete!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}
