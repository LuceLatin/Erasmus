import { Category } from '../../models/Institution/Category.js';
import * as categoriesMock from './categoriesMock.js';

async function categoriesExist() {
  const categories = await Category.countDocuments();
  if (categories > 0) {
    console.log('Categories already exist in the database');
    return true;
  }
  return false;
}

export async function seedCategories() {
  if (!(await categoriesExist())) {
    console.log('Seeding categories');
    for (const category of categoriesMock.categories) {
      const newCategory = new Category({
        name: category.name,
      });
      await newCategory.save();
    }
  }
}
