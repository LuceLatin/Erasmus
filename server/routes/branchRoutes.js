import express from 'express';
import mongoose from 'mongoose';

import { checkAuthorization, checkAuthorization2, validateToken } from '../jwt.js';
import { Branch } from '../models/Institution/Branch.js';
import { Institution } from '../models/Institution/Institution.js';

const branchRoutes = express.Router();

branchRoutes.get(
  '/api/branches/grouped',
  validateToken,
  checkAuthorization2(['koordinator', 'student', 'profesor']),
  async (req, res) => {
    try {
      const branches = await Branch.find().populate('institution');

      const groupedBranches = groupBranchesByInstitution(branches);

      res.json(Object.values(groupedBranches));
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch branches.' });
    }
  },
);

branchRoutes.get(
  '/api/branches/grouped/:id',
  validateToken,
  checkAuthorization2(['koordinator', 'student', 'profesor']),
  async (req, res) => {
    try {
      const branchId = req.params.id;
      const userBranch = await Branch.findById(branchId);

      const branches = await Branch.find({ category: userBranch.category }).populate('institution');

      if (branches.length === 0) {
        return res.status(404).json({ error: 'No branches found for the specified category.' });
      }

      const groupedBranches = groupBranchesByInstitution(branches);

      res.json(Object.values(groupedBranches));
    } catch (error) {
      console.error('Error fetching branches:', error);
      res.status(500).json({ error: 'Failed to fetch branches.' });
    }
  },
);

branchRoutes.get(
  '/api/branches/:id',
  validateToken,
  checkAuthorization2(['koordinator', 'student', 'profesor']),
  async (req, res) => {
    try {
      const branch = await Branch.findById(req.params.id).populate('institution');
      if (!branch) {
        return res.status(404).json({ error: 'Branch not found' });
      }
      res.status(200).json(branch);
    } catch (error) {
      console.error('Error fetching branch:', error);
      res.status(500).json({ error: 'Failed to fetch branch' });
    }
  },
);

branchRoutes.get('/api/branches', async (req, res) => {
  const { institution } = req.query; 

  if (!institution) {
    return res.status(400).json({ error: 'institutionId is required' });
  }

  try {
    const branches = await Branch.find({ institution }); 
    res.status(200).json(branches);
  } catch (error) {
    console.error('Error fetching branches:', error);
    res.status(500).json({ error: 'Failed to fetch branches' });
  }
});

branchRoutes.get('/api/allbranches', async (req, res) => {

  try {
    const branches = await Branch.find(); 
    res.status(200).json(branches);
  } catch (error) {
    console.error('Error fetching branches:', error);
    res.status(500).json({ error: 'Failed to fetch branches' });
  }
});

branchRoutes.put('/api/:institutionId/branches/edit/:branchId', checkAuthorization, async (req, res) => {
  try {
    const { name, address, city, country } = req.body;

    const updatedBranch = await Branch.findByIdAndUpdate(
      req.params.branchId, 
      { name, address, city, country },
      { new: true, runValidators: true },
    );

    if (!updatedBranch) {
      return res.status(404).json({ error: 'Branch not found' });
    }

    res.status(200).json(updatedBranch);
  } catch (error) {
    console.error('Error updating branch:', error);
    res.status(500).json({ error: 'Failed to update branch' });
  }
});

branchRoutes.delete('/api/branches/:id', checkAuthorization, async (req, res) => {
  try {
    const deletedBranch = await Branch.findByIdAndDelete(req.params.id);
    if (!deletedBranch) {
      return res.status(404).json({ error: 'Branch not found' });
    }
    res.status(200).json({ message: 'Branch deleted successfully' });
  } catch (error) {
    console.error('Error deleting branch:', error);
    res.status(500).json({ error: 'Failed to delete branch' });
  }
});

branchRoutes.post('/api/branches/add', checkAuthorization, async (req, res) => {
  try {
    const newBranch = new Branch(req.body);
    await newBranch.save();
    res.status(201).json(newBranch);
  } catch (error) {
    console.error('Error creating branch:', error);
    res.status(500).json({ error: 'Failed to create branch' });
  }
});

const groupBranchesByInstitution = (branches) => {
  return branches.reduce((acc, branch) => {
    const institutionId = branch.institution._id;
    if (!acc[institutionId]) {
      acc[institutionId] = {
        institution: branch.institution,
        branches: [],
      };
    }
    const { institution, ...branchWithoutInstitution } = branch._doc;
    acc[institutionId].branches.push(branchWithoutInstitution);
    return acc;
  }, {});
};

branchRoutes.get(
  '/api/branches',
  validateToken,
  checkAuthorization2(['koordinator', 'student', 'profesor']),
  async (req, res) => {
    try {
      let branches;
      if (req.query.categoryId) {
        branches = await Branch.find({ category: req.query.categoryId }).populate('institution');
      } else {
        branches = await Branch.find().populate('institution');
      }
      res.json(branches);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch branches.' });
    }
  },
);

export default branchRoutes;
