import express from 'express';
import dotenv from 'dotenv';
import auth from '../middlewares/auth.js';
import UserController from '../controllers/userController.js';
dotenv.config();

const uR = express.Router();

const uC = new UserController();

uR.post('/testing', uC.testing);
uR.post('/send-email', uC.sendEmail);
uR.post('/register', uC.register);
uR.post('/login', uC.login);
uR.post('/verify-otp', uC.verifyOtp);
uR.post('/send-token', uC.sendToken);
uR.post('/get-user', auth, uC.sendUserInfo);

export default uR;