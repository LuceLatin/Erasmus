import bcrypt from 'bcryptjs';
import express from 'express';

import { checkAuthorization, createTokens, validateToken } from '../jwt.js';
import { User } from '../models/User/User.js';

const authenticationRouter = express.Router();

authenticationRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Check if user is already logged in

  User.findOne({ email: email }).then((user) => {
    if (!user) {
      res.status(404).json({ message: 'User not found.' });
    } else {
      const dbPassword = user.password;
      bcrypt.compare(password, dbPassword).then((match) => {
        if (!match) {
          res.status(401).json({
            message: 'Wrong Username and Password Combination!',
          });
        } else {
          const accessToken = createTokens(user);
          res.cookie('access-token', accessToken, {
            maxAge: 60 * 60 * 24 * 1000,
          });
          res.status(200).json({
            message: 'Logged in successfully.',
          });
        }
      });
    }
  });
});

authenticationRouter.post('/logout', (req, res) => {
  res.clearCookie('access-token');

  res.status(200).json({ message: 'Logged out successfully.' });
});

authenticationRouter.get('/me', validateToken, (req, res) => {
  User.findById(req.userId)
    .select('-password')
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      res.status(500).json({ message: 'Error fetching user data', error: err });
    });
});

authenticationRouter.post('/check-old-password', async (req, res) => {
  const { username, oldPassword } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'Korisnik nije pronađen.' });
    }

    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Stara lozinka nije ispravna.' });
    }

    res.status(200).json({ message: 'Stara lozinka je ispravna.' });
  } catch (error) {
    console.error('Greška prilikom provjere lozinke:', error);
    res.status(500).json({ message: 'Došlo je do greške na serveru.' });
  }
});

authenticationRouter.post('/change-password', async (req, res) => {
  const { username, newPassword } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'Korisnik nije pronađen.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Lozinka je uspješno promijenjena.' });
  } catch (error) {
    console.error('Greška prilikom promjene lozinke:', error);
    res.status(500).json({ message: 'Došlo je do greške na serveru.' });
  }
});



export default authenticationRouter;
