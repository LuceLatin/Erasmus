import {seedCategories} from "./categories/categoriesSeed.js";
import {seedInstitutions} from "./institution/institution.js";
import {seedUsers} from "./user/user.js";

export async function seedDb() {
  await seedCategories()
  await seedInstitutions()
  await seedUsers()
  console.log('Database seeded')
}
