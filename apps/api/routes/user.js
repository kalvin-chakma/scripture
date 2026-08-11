const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { SECRET } = require("../middleware/auth");
const passport = require("passport");

const router = express.Router();

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

    res.json({ message: "Logged in successfully", token, User });
  } catch (error) {
    res.status(500).json({ message: "Error signing in", error: error.message });
  }
});

//Google OAuth routes
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/signin",
    session: false,
  }),
  (req, res) => {
    const token = jwt.sign(
      { userID: req.user._id, username: req.user.username },
      SECRET,
      { expiresIn: "1h" }
    );

    res.redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${token}`);
  }
);

//Get User Profile
router.get("/userdata", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, SECRET);
    const user = await User.findById(decoded.userID).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching profile", error: error.message });
  }
});

module.exports = router;
