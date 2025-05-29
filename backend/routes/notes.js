const express = require("express");
const Note = require("../models/note");
const { authenticateJWT } = require("../middleware/auth");

const router = express.Router();

router.post("/save", authenticateJWT, async (req, res) => {
  const { title, content, noteType } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  try {
    const newNote = new Note({
      user_id: req.user_id,
      title,
      noteType: noteType,
      content,
    });

    await newNote.save();
    res.status(201).json({ message: "Note saved successfully", note: newNote });
  } catch (error) {
    res.status(500).json({ message: "Failed to save note", error });
  }
});

router.get("/my-notes", authenticateJWT, async (req, res) => {
  try {
    const userId = req.user_id;
    const notes = await Note.find({ user_id: userId }).sort({ createdAt: -1 });

    res.status(200).json({ notes });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notes", error });
  }
});

module.exports = router;
