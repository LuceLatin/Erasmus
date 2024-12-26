import express from 'express';

import { checkAuthorization, checkAuthorization2, createTokens, validateToken } from '../jwt.js';
import { ErasmusCompetition } from '../models/ErasmusCompetition/ErasmusCompetition.js';

const erasmusCompetitionRouter = express.Router();

erasmusCompetitionRouter.post('/api/competitions', checkAuthorization, async (req, res) => {
  try {
    const newCompetition = new ErasmusCompetition(req.body);
    await newCompetition.save();
    res.status(201).json(newCompetition);
  } catch (error) {
    console.error('Error creating competition:', error);
    res.status(500).json({ error: 'Failed to create competition' });
  }
});

erasmusCompetitionRouter.get(
  '/api/competitions',
  validateToken,
  checkAuthorization2(['koordinator', 'student', 'profesor']),
  async (req, res) => {
    try {
      const competitions = await ErasmusCompetition.find();
      res.json(competitions);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch competitions.' });
    }
  },
);

erasmusCompetitionRouter.get(
  '/api/competitions/:id',
  validateToken,
  checkAuthorization2(['koordinator', 'student', 'profesor']),
  async (req, res) => {
    try {
      const competition = await ErasmusCompetition.findById(req.params.id);
      if (!competition) {
        return res.status(404).json({ error: 'Competition not found' });
      }
      res.status(200).json(competition);
    } catch (error) {
      console.error('Error fetching competition:', error);
      res.status(500).json({ error: 'Failed to fetch competition' });
    }
  },
);

erasmusCompetitionRouter.put('/api/competitions/:id', checkAuthorization, async (req, res) => {
  try {
    const updatedCompetition = await ErasmusCompetition.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedCompetition) {
      return res.status(404).json({ error: 'Competition not found' });
    }
    res.status(200).json(updatedCompetition);
  } catch (error) {
    console.error('Error updating competition:', error);
    res.status(500).json({ error: 'Failed to update competition' });
  }
});

erasmusCompetitionRouter.delete('/api/competitions/:id', checkAuthorization, async (req, res) => {
  try {
    const deletedCompetition = await ErasmusCompetition.findByIdAndDelete(req.params.id);
    if (!deletedCompetition) {
      return res.status(404).json({ error: 'Competition not found' });
    }
    res.status(200).json({ message: 'Competition deleted successfully' });
  } catch (error) {
    console.error('Error deleting competition:', error);
    res.status(500).json({ error: 'Failed to delete competition' });
  }
});

export default erasmusCompetitionRouter;
