import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: [4, 'Username must be at least 4 characters long.'],
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    OIB: {
      type: Number,
      required: true,
      validate: {
        validator: function (v) {
          return v.toString().length === 11;
        },
        message: 'OIB must be exactly 11 digits long.',
      },
    },
    address: { type: String, optional: true },
    city: { type: String, optional: true },
    country: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
    },
    password: { type: String, required: true },

    role: {
      type: String,
      required: true,
      enum: ['student', 'profesor', 'koordinator'],
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Branch',
      optional: true,
    },
  },
  { timestamps: true },
);

export const User = mongoose.model('User', userSchema);
