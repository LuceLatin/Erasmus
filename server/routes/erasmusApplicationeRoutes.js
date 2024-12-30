import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';

import { connectDB } from '../dbInstance.js';
import { checkAuthorization, validateToken } from '../jwt.js';
import { ApplicantChoices } from '../models/ErasmusCompetition/ApplicantChoices.js';
import { ErasmusApplication } from '../models/ErasmusCompetition/Application.js';
import { uploadFileToGridFS } from '../services/fsgrid.js';
import { ObjectId } from 'mongodb';
import { GridFSBucket } from 'mongodb';

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

erasmusApplicationRouter.get('/api/:competitionId/applications', checkAuthorization, async (req, res) => {
  const { competitionId } = req.params;

  try {
    const applications = await ErasmusApplication.find({ erasmusCompetition: competitionId })
      .populate('user', 'username email')
      .exec();

    res.status(200).json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Došlo je do greške prilikom dohvaćanja prijava.' });
  }
});

const getFileDetails = async (fileIds, bucket) => {
  const files = await bucket.find({ _id: { $in: fileIds.map(id => new ObjectId(id)) } }).toArray();
  return files.map(file => ({
    _id: file._id,
    filename: file.filename
  }));
};


erasmusApplicationRouter.get('/api/:competitionId/applications/:applicationId', async (req, res) => {
  try {
    const { competitionId, applicationId } = req.params;

      const application = await ErasmusApplication.findOne({
        _id: applicationId,
        erasmusCompetition: competitionId,
      })
        .populate('user', 'username email firstName lastName')
        .populate('erasmusCompetition', 'title')
        .exec();

      if (!application) {
        return res.status(404).json({ error: 'Prijava nije pronađena.' });
      }
      const { bucket } = await connectDB();  
      const files = application.files ? await getFileDetails(application.files, bucket) : []; 
  
      res.json({
        ...application.toObject(),
        files, //return details
      });
 
  } 
  catch (error) {
    console.error('Error fetching application details:', error);
    res.status(500).send('Failed to fetch application details');
  }
});



erasmusApplicationRouter.get('/api/applications/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const applications = await ErasmusApplication.find({ user: userId })
      .populate('user', 'username email')
      .populate('erasmusCompetition', '_id title institutionType')
      .exec();

    res.status(200).json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Došlo je do greške prilikom dohvaćanja prijava.' });
  }
});

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

erasmusApplicationRouter.delete('/api/applications-delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { bucket } = await connectDB();
    if (!bucket) {
      console.error('Bucket is not initialized.');
      return res.status(500).json({ message: 'GridFS bucket is not available' });
    }

    const application = await ErasmusApplication.findById(id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.files && application.files.length > 0) {
      for (const fileId of application.files) {
        try {
          const objectId = mongoose.Types.ObjectId.isValid(fileId) ? new mongoose.Types.ObjectId(fileId) : null;

          if (!objectId) {
            console.warn(`Invalid file ID: ${fileId}, skipping...`);
            continue;
          }

          await bucket.delete(objectId);
          console.log(`File with ID ${fileId} deleted successfully.`);
        } catch (fileError) {
          console.error(`Error deleting file with ID ${fileId}:`, fileError);
        }
      }
    }

    await ErasmusApplication.findByIdAndDelete(id);

    await ApplicantChoices.deleteMany({ application: id });

    res.status(200).json({ message: 'Application, related choices, and files deleted successfully' });
  } catch (error) {
    console.error('Error deleting application and related data:', error);
    res.status(500).json({ message: 'Failed to delete application and related data' });
  }
});


erasmusApplicationRouter.get('/api/past-applications', async (req, res) => {
  try {
    const { userId, role } = req.query;
    if (!userId || !role) {
      return res.status(400).json({ message: 'User ID and role are required' });
    }

    const today = new Date();
    if (role === 'koordinator') {
      const applications = await ErasmusApplication.find()
        .populate({
          path: 'erasmusCompetition',
          match: { endDate: { $lt: today } },
        })
        .populate('user')
        .lean();

      const filteredApplications = applications.filter(app => app.erasmusCompetition);
      return res.json(filteredApplications);

    } 
    else {
      const applications = await ErasmusApplication.find({ user: userId })
        .populate({
          path: 'erasmusCompetition',
          match: { endDate: { $lt: today } },
        })
        .lean();
      const filteredApplications = applications.filter(app => app.erasmusCompetition !== null);
      return res.json(filteredApplications);
    }
  }
  catch (error) {
    console.error('Error in /api/past-applications:', error); 
    res.status(500).json({ message: 'Failed to fetch applications' });
  }
});

  
//get and download file
erasmusApplicationRouter.get('/api/download/:id', async (req, res) => {
  const { bucket } = await connectDB();

  if (!bucket) {
    return res.status(500).send('GridFS bucket is not initialized');
  }

  const fileId = req.params.id;

  try {
    const objectId = new ObjectId(fileId);

    const downloadStream = bucket.openDownloadStream(objectId);
    
    //if the file exists
    downloadStream.pipe(res)
      .on('error', (err) => {
        console.error('Error downloading file:', err);
        res.status(500).send('Error downloading file');
      })
      .on('finish', () => {
        console.log('Download complete');
      });
  } 
  catch (error) {
    console.error('Error in download route:', error);
    res.status(500).send('An error occurred');
  }
});

erasmusApplicationRouter.get('/api/active-applications', async (req, res) => {
  try {
    const { userId, role } = req.query;
    if (!userId || !role) {
      return res.status(400).json({ message: 'User ID and role are required' });
    }

    const today = new Date();
    if (role === 'koordinator') {
      const applications = await ErasmusApplication.find()
        .populate({
          path: 'erasmusCompetition',
          match: { endDate: { $gte: today } }, // Aktivni natječaji
        })
        .populate('user')
        .lean();

      const filteredApplications = applications.filter(app => app.erasmusCompetition);
      return res.json(filteredApplications);
    } else {
      const applications = await ErasmusApplication.find({ user: userId })
        .populate({
          path: 'erasmusCompetition',
          match: { endDate: { $gte: today } }, // Aktivni natječaji za korisnika
        })
        .lean();

      const filteredApplications = applications.filter(app => app.erasmusCompetition !== null);
      return res.json(filteredApplications);
    }
  } catch (error) {
    console.error('Error in /api/active-applications:', error);
    res.status(500).json({ message: 'Failed to fetch active applications' });
  }
});

