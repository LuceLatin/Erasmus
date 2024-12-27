import bcrypt from 'bcryptjs';
import express, { application } from 'express';

import { checkAuthorization, createTokens, validateToken } from '../jwt.js';
import { User } from '../models/User/User.js';
import { ApplicantChoices } from '../models/ErasmusCompetition/ApplicantChoices.js';

const choiceRouter = express.Router();

choiceRouter.get('/api/:applicationId/choices', async (req, res) => {
    try {
      const { applicationId } = req.params;
  
      // Fetch choices and populate the branch name
      const choices = await ApplicantChoices.find({ application: applicationId })
        .populate('branch', 'name');  
  
      res.status(200).json(choices);
    } catch (error) {
      console.error('Error fetching choices:', error);
      res.status(500).json({ error: 'Failed to fetch choices' });
    }
  });
  
  


export default choiceRouter;
