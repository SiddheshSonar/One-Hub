import mongoose from 'mongoose';

const socialsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  is_connected: {
    type: Boolean,
    required: true,
  },
  link: {
    type: String,
  },
  token: {
    type: String,
  },
  refresh_token: {
    type: String,
  },
});

const suggestionSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  userInfo: {
    type: String,
    required: true,
  },
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique:true,
  },
  phone: {
    type: Number,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
  },
  pfp: {
    type: String,
  },
  socials: [socialsSchema],
  suggestion: [suggestionSchema],
});

const User = mongoose.model("user", userSchema);

export default User;