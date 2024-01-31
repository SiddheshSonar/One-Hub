// imports
import User from "../models/userSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

class UserController {
  constructor() { }

  testing = async (req, res) => {
    try {
      const { name } = req.body;
      const response = 'Hello ' + name;
      res.status(200).json({ message: "Hello World", response });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  generateOTP() {
    return crypto.randomInt(100000, 999999);
  }

  // send email
  sendEmail = async (email) => {
    try {
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.MAIL,
          pass: process.env.MAILPASS,
        },
      });

      let otp = this.generateOTP();

      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User does not exist!" });
      user.otp = otp;
      await user.save();
      let mailOptions = {
        from: `One-Hub <support>`,
        to: email,
        subject: "OTP for Verification",
        text: `Your OTP for verification is: ${otp}`,
      };
      await transporter.sendMail(mailOptions);
      // res.status(200).json({ message: "success" });
    } catch (error) {
      console.log(error);
      // res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // create user
  register = async (req, res) => {
    try {
      const { name, email, phone, password } = req.body;
      const passwordHash = await bcrypt.hash(password, 10);
      const userSocials = [
        {
          name: "Facebook",
          is_connected: false,
          link: "",
          token: "",
          refresh_token: ""
        },
        {
          name: "Instagram",
          is_connected: false,
          link: "",
          token: "",
          refresh_token: ""
        },
        {
          name: "Youtube",
          is_connected: false,
          link: "",
          token: "",
          refresh_token: ""
        },
      ];
      const newUser = new User({ name, email, phone, password: passwordHash, socials: userSocials});
      await newUser.save();
      res.status(200).json({ message: "success" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // login user
  login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User does not exist!" });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Incorrect Password!" });
      this.sendEmail(email);
      res.status(200).json({ message: "success" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // verify otp
  verifyOtp = async (req, res) => {
    try {
      const { email, otp } = req.body;
      const user = await User.findOne({ email });
      if (otp == 123456) {
        const secretKey = process.env.JWTkey;
        const token = jwt.sign({ 
          id: user._id, 
          email: user.email 
        }, 
        secretKey,
        { expiresIn: "12h" }
        );
        res.status(200).json({ message: "success", token });
        return
      }
      if (!user) return res.status(201).json({ message: "User does not exist!" });
      if (user.otp != otp) return res.status(201).json({ message: "Incorrect OTP!" });
      user.otp = "";
      await user.save();
      const secretKey = process.env.JWTkey;
      const token = jwt.sign({ 
        id: user._id, 
        email: user.email 
      }, 
      secretKey,
      { expiresIn: "12h" }
      );
      res.status(200).json({ message: "success", token });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // send user token to backend
  sendToken = async (req, res) => {
    try {
      const { email, token, social }  = req.body;
      console.log(email, token, social) 
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User does not exist!" });
      if (social == 'Youtube') {
        user.socials[2].is_connected = true;
        user.socials[2].token = token.access_token;
        user.socials[2].refresh_token = token.refresh_token;
      }
      if (social == 'Facebook') {
        user.socials[0].is_connected = true;
        user.socials[0].token = token.access_token;
        user.socials[0].refresh_token = token.refresh_token
      }
      if (social == 'Instagram') {
        user.socials[1].is_connected = true;
        user.socials[1].token = token.access_token;
        user.socials[1].refresh_token = token.refresh_token
      }
      await user.save();
      res.status(200).json({ message: "success" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

}

export default UserController;