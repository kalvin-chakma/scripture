const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { SECRET } = require("../middleware/auth");

const router = express.Router();

// User signup
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(403).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash password with salt rounds = 10

    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ userID: newUser._id }, SECRET, { expiresIn: '1h' });

    res.json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
});

// User signin
router.post('/signin', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ userID: user._id }, SECRET, { expiresIn: '1h' });

    res.json({ message: "Logged in successfully", token });
  } catch (error) {
    res.status(500).json({ message: "Error signing in", error });
  }
});

module.exports = router;
