const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const prisma = require("@scripture/db");
const { SECRET, authenticateJWT } = require("../middleware/auth");
const passport = require("passport");

const router = express.Router();

// User signup
router.post("/signup", async (req, res) => {
  const { name, username, password } = req.body;

  try {
    if (!name || !username || !password) {
      return res
        .status(400)
        .json({ message: "Name, username and password are required" });
    }

    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return res.status(403).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: { username, password: hashedPassword, displayName: name },
    });

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
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ userID: user.id }, SECRET, { expiresIn: "1h" });

    res.json({ message: "Logged in successfully", token });
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
      { userID: req.user.id, username: req.user.username },
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
    const user = await prisma.user.findUnique({
      where: { id: decoded.userID },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatar: true,
        googleId: true,
        password: true,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { password, ...userWithoutPassword } = user;
    res.json({ user: { ...userWithoutPassword, hasPassword: Boolean(password) } });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching profile", error: error.message });
  }
});

// Update display name and/or avatar
router.put("/profile", authenticateJWT, async (req, res) => {
  const { name, avatar } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ message: "Name is required" });
  }

  try {
    const user = await prisma.user.update({
      where: { id: req.user_id },
      data: { displayName: name.trim(), avatar: avatar || null },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatar: true,
        googleId: true,
      },
    });

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
});

// Change password - only for accounts that have one set
router.put("/password", authenticateJWT, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: "Current and new password are required" });
  }

  if (newPassword.length < 7) {
    return res
      .status(400)
      .json({ message: "New password must be at least 7 characters" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: req.user_id } });

    if (!user?.password) {
      return res
        .status(400)
        .json({ message: "This account has no password to change" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: req.user_id },
      data: { password: hashedPassword },
    });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update password", error: error.message });
  }
});

module.exports = router;
