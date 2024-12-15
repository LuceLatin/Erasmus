import {seedCategories} from "./categories/categoriesSeed.js";
import {seedInstitutions} from "./institution/institution.js";

export function seedDb() {
  seedCategories()
  seedInstitutions()
  console.log('Database seeded')
}
