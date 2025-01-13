import bcrypt from 'bcryptjs';
import express from 'express';

import { checkAuthorization, checkAuthorization2 } from '../jwt.js';
import { User } from '../models/User/User.js';

const userRouter = express.Router();

userRouter.get('/api/users', checkAuthorization, checkAuthorization2('koordinator'), async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

userRouter.post('/api/users/add', checkAuthorization2('koordinator'), async (req, res) => {
  try {
    const { email, username } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email: email }, { username: username }],
    });

    if (existingUser) {
      return res.status(400).json({
        error: 'Email or Username already exists. Please choose a different one.',
      });
    }

    const newUser = new User(req.body);
    newUser.password = bcrypt.hashSync(newUser.password, 10);

    newUser.branch = newUser._id;

    await newUser.save();

    res.status(201).json({ message: 'User successfully created', user: newUser });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'Failed to add user' });
  }
});

userRouter.delete('/api/users/:id', checkAuthorization, checkAuthorization2('koordinator'), async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User successfully deleted' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

userRouter.put('/api/users/:id', checkAuthorization, checkAuthorization2('koordinator'), async (req, res) => {
  try {
    const { id } = req.params;
    const { email, username, password, ...otherFields } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
      _id: { $ne: id },
    });

    if (existingUser) {
      return res.status(400).json({
        error: 'Email or Username already exists. Please choose a different one.',
      });
    }

    const updateData = { ...otherFields };

    if (email) updateData.email = email;
    if (username) updateData.username = username;
    if (password) updateData.password = bcrypt.hashSync(password, 10);

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User successfully updated', user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

userRouter.get('/api/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default userRouter;
