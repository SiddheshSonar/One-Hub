// imports
import User from "../models/userSchema.js";
import bcrypt from "bcryptjs";

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

  // create user
  register = async (req, res) => {
    try {
      const { name, email, phone, password } = req.body;
      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = new User({ name, email, phone, password: passwordHash });
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
      if (!user) return res.status(404).json({ message: "User does not exist" });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Incorrect password" });
      res.status(200).json({ message: "success" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

export default UserController;