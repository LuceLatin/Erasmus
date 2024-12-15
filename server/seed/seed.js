import {seedCategories} from "./categories/categoriesSeed.js";
import {seedInstitutions} from "./institution/institution.js";

export async function seedDb() {
  await seedCategories()
  await seedInstitutions()
  console.log('Database seeded')
}
