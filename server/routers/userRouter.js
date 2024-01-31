import express from 'express';
import dotenv from 'dotenv';
import auth from '../middlewares/auth.js';
import UserController from '../controllers/userController.js';
dotenv.config();

const uR = express.Router();

const uC = new UserController();

uR.post('/testing', uC.testing);
uR.post('/register', uC.register);
uR.post('/login', uC.login);

export default uR;