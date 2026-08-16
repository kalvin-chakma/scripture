const express = require("express");
const prisma = require("@scripture/db");
const { authenticateJWT } = require("../middleware/auth");

const router = express.Router();

//create and save note of authenticated user
router.post("/save", authenticateJWT, async (req, res) => {
  const { title, content, noteType } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  try {
    const newNote = await prisma.note.create({
      data: {
        userId: req.user_id,
        title,
        noteType: noteType,
        content,
      },
    });

    res.status(201).json({ message: "Note saved successfully", note: newNote });
  } catch (error) {
    res.status(500).json({ message: "Failed to save note", error });
  }
});

//get all notes of a authenticated user
router.get("/my-notes", authenticateJWT, async (req, res) => {
  try {
    const userId = req.user_id;
    const notes = await prisma.note.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ notes });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notes", error });
  }
});

// Update note by ID
router.put("/update/:id", authenticateJWT, async (req, res) => {
  const { title, content, noteType } = req.body;

  try {
    const { count } = await prisma.note.updateMany({
      where: { id: req.params.id, userId: req.user_id },
      data: { title, content, noteType },
    });

    if (count === 0) {
      return res
        .status(404)
        .json({ message: "Note not found or unauthorized" });
    }

    const updatedNote = await prisma.note.findUnique({
      where: { id: req.params.id },
    });

    res
      .status(200)
      .json({ message: "Note updated successfully", note: updatedNote });
  } catch (error) {
    res.status(500).json({ message: "Failed to update note", error });
  }
});

// Delete note by ID
router.delete("/delete/:id", authenticateJWT, async (req, res) => {
  try {
    const { count } = await prisma.note.deleteMany({
      where: { id: req.params.id, userId: req.user_id },
    });

    if (count === 0) {
      return res
        .status(404)
        .json({ message: "Note not found or unauthorized" });
    }

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete note", error });
  }
});

module.exports = router;
