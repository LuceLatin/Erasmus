import { Branch } from '../../models/Institution/Branch.js';
import { User } from '../../models/User/User.js';

const userExists = async () => {
  const users = await User.countDocuments();
  if (users > 0) {
    console.log('Users already exist in the database');
    return true;
  }
  return false;
};

export const seedUsers = async () => {
  try {
    if (await userExists()) return;

    const tehnoTvrtkaBranch = await Branch.findOne({ name: 'Glavna podružnica TehnoTvrtke' });
    const sveucilisteEduBranch = await Branch.findOne({ name: 'Gradski kampus SveučilištaEdu' });

    const usersMock = [
      {
        username: 'studentUser',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('2000-01-01'),
        OIB: 12345678901,
        address: '123 Main St',
        city: 'Anytown',
        country: 'CountryA',
        email: 'student@example.com',
        password: 'password123',
        role: 'student',
        branch: tehnoTvrtkaBranch._id,
      },
      {
        username: 'professorUser',
        firstName: 'Jane',
        lastName: 'Smith',
        dateOfBirth: new Date('1980-05-15'),
        OIB: 23456789012,
        address: '456 Elm St',
        city: 'Othertown',
        country: 'CountryB',
        email: 'professor@example.com',
        password: 'password123',
        role: 'profesor',
        branch: sveucilisteEduBranch._id,
      },
      {
        username: 'coordinatorUser',
        firstName: 'Alice',
        lastName: 'Johnson',
        dateOfBirth: new Date('1990-09-25'),
        OIB: 34567890123,
        address: '789 Oak St',
        city: 'Sometown',
        country: 'CountryC',
        email: 'coordinator@example.com',
        password: 'password123',
        role: 'koordinator',
      },
    ];

    await User.insertMany(usersMock);
  } catch (e) {
    console.error(e);
  }
};
