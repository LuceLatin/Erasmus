import { Branch } from '../../models/Institution/Branch.js';
import { Institution } from '../../models/Institution/Institution.js';
import { branches } from './branchMock.js';
import { institutions } from './institutionsMock.js';

const institutionExists = async () => {
  const institutions = await Institution.countDocuments();
  if (institutions > 0) {
    console.log('Institutions already exist in the database');
    return true;
  }
  return false;
};

export const seedInstitutions = async () => {
  try {
    if (await institutionExists()) return;

    const createdInstitutions = await Institution.insertMany(institutions);

    const branchData = await branches();
    await Branch.insertMany(branchData);

    console.log('Seeding complete');
  } catch (err) {
    console.error('Seeding error:', err);
  }
};
