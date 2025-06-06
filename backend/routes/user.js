const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const passport = require("passport");

const router = express.Router();
const SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// User signup
router.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(403).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res
      .status(201)
      .json({ message: "User created successfully", success: true });
  } catch (error) {
    console.error("Signup error:", error.message);
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
});

// User signin
router.post("/signin", async (req, res) => {
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

    const token = jwt.sign({ userID: user._id }, SECRET, { expiresIn: "1h" });

    res.json({ message: "Logged in successfully", token });
  } catch (error) {
    res.status(500).json({ message: "Error signing in", error: error.message });
  }
});

// Google OAuth login
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/" }),
  (req, res) => {
    const token = jwt.sign({ userID: req.user._id }, SECRET, {
      expiresIn: "1h",
    });

    res.redirect(
      `${FRONTEND_URL}/auth/callback?token=${token}&user=${encodeURIComponent(
        JSON.stringify({
          username: req.user.username,
          id: req.user._id,
        })
      )}`
    );
  }
);

module.exports = router;
