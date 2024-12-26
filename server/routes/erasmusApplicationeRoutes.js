import express from 'express';
import multer from 'multer';

import { connectDB } from '../dbInstance.js';
import { validateToken } from '../jwt.js';
import { ApplicantChoices } from '../models/ErasmusCompetition/ApplicantChoices.js';
import { ErasmusApplication } from '../models/ErasmusCompetition/Application.js';
import { uploadFileToGridFS } from '../services/fsgrid.js';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const erasmusApplicationRouter = express.Router();

erasmusApplicationRouter.post(
  '/api/erasmus-application',
  validateToken,
  upload.fields([
    { name: 'cv', maxCount: 1 },
    { name: 'motivationalLetter', maxCount: 1 },
    { name: 'schoolGrades', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { bucket } = await connectDB();
      const user = JSON.parse(req.body.user);
      const competitionData = JSON.parse(req.body.competitionData);
      const userChoices = JSON.parse(req.body.userChoice);

      const erasmusApplicationBody = {
        user: user._id,
        erasmusCompetition: competitionData._id,
      };

      const newApplication = new ErasmusApplication(erasmusApplicationBody);
      await newApplication.save();

      const filesToSave = [];

      if (req.files && req.files.schoolGrades) {
        const schoolGradesFile = req.files.schoolGrades[0];
        const schoolGradesGridFSFile = await uploadFileToGridFS(newApplication._id, schoolGradesFile, bucket);
        filesToSave.push({ filename: schoolGradesFile.originalname, filePath: schoolGradesGridFSFile.fileId });
      }

      if (req.files && req.files.cv) {
        const cvFile = req.files.cv[0];
        const cvGridFSFile = await uploadFileToGridFS(newApplication._id, cvFile, bucket);
        filesToSave.push({ filename: cvFile.originalname, filePath: cvGridFSFile.fileId });
      }

      if (req.files && req.files.motivationalLetter) {
        const motivationalLetterFile = req.files.motivationalLetter[0];
        const motivationalLetterGridFSFile = await uploadFileToGridFS(
          newApplication._id,
          motivationalLetterFile,
          bucket,
        );
        filesToSave.push({
          filename: motivationalLetterFile.originalname,
          filePath: motivationalLetterGridFSFile.fileId,
        });
      }

      newApplication.files = filesToSave.map((file) => file.filePath);
      await newApplication.save();

      for (const [key, choice] of Object.entries(userChoices)) {
        if (choice) {
          const applicantChoicesBody = {
            application: newApplication._id,
            branch: choice._id,
            choice: getBranchChoice(key),
          };
          const applicantChoices = new ApplicantChoices(applicantChoicesBody);
          await applicantChoices.save();
        }
      }

      res.status(201).json({ message: 'Application created successfully', application: newApplication });
    } catch (error) {
      console.error('Error creating application:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to create application' });
      }
    }
  },
);

function getBranchChoice(branchKey) {
  if (branchKey === 'firstBranch') {
    return 'first';
  } else if (branchKey === 'secondBranch') {
    return 'second';
  } else if (branchKey === 'thirdBranch') {
    return 'third';
  }
  throw new Error('Invalid branch key');
}
