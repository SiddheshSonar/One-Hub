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

});

const User = mongoose.model("user", userSchema);

export default User;