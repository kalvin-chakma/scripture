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

//get all notes owned by or shared with the authenticated user
router.get("/my-notes", authenticateJWT, async (req, res) => {
  try {
    const userId = req.user_id;
    const notes = await prisma.note.findMany({
      where: {
        OR: [{ userId }, { collaborators: { some: { userId } } }],
      },
      orderBy: { createdAt: "desc" },
    });

    res
      .status(200)
      .json({ notes: notes.map((note) => ({ ...note, isOwner: note.userId === userId })) });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notes", error });
  }
});

// Update note by ID - owner or collaborator
router.put("/update/:id", authenticateJWT, async (req, res) => {
  const { title, content, noteType } = req.body;

  try {
    const note = await prisma.note.findUnique({
      where: { id: req.params.id },
      include: { collaborators: true },
    });

    const hasAccess =
      note &&
      (note.userId === req.user_id ||
        note.collaborators.some((c) => c.userId === req.user_id));

    if (!hasAccess) {
      return res
        .status(404)
        .json({ message: "Note not found or unauthorized" });
    }

    const updatedNote = await prisma.note.update({
      where: { id: req.params.id },
      data: { title, content, noteType },
    });

    res
      .status(200)
      .json({ message: "Note updated successfully", note: updatedNote });
  } catch (error) {
    res.status(500).json({ message: "Failed to update note", error });
  }
});

// List collaborators on a note - owner or collaborator
router.get("/:id/collaborators", authenticateJWT, async (req, res) => {
  try {
    const note = await prisma.note.findUnique({
      where: { id: req.params.id },
      include: {
        collaborators: {
          include: {
            user: { select: { id: true, username: true, displayName: true, avatar: true } },
          },
        },
      },
    });

    const hasAccess =
      note &&
      (note.userId === req.user_id ||
        note.collaborators.some((c) => c.userId === req.user_id));

    if (!hasAccess) {
      return res.status(404).json({ message: "Note not found or unauthorized" });
    }

    res.status(200).json({
      isOwner: note.userId === req.user_id,
      collaborators: note.collaborators.map((c) => c.user),
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch collaborators", error });
  }
});

// Add a collaborator by email - owner only
router.post("/:id/collaborators", authenticateJWT, async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const note = await prisma.note.findUnique({ where: { id: req.params.id } });

    if (!note || note.userId !== req.user_id) {
      return res.status(404).json({ message: "Note not found or unauthorized" });
    }

    const collaboratorUser = await prisma.user.findUnique({
      where: { username: email },
    });

    if (!collaboratorUser) {
      return res
        .status(404)
        .json({ message: "No account found with that email" });
    }

    if (collaboratorUser.id === note.userId) {
      return res
        .status(400)
        .json({ message: "This user already owns the note" });
    }

    await prisma.noteCollaborator.upsert({
      where: {
        noteId_userId: { noteId: note.id, userId: collaboratorUser.id },
      },
      create: { noteId: note.id, userId: collaboratorUser.id },
      update: {},
    });

    res.status(201).json({
      message: "Collaborator added successfully",
      collaborator: {
        id: collaboratorUser.id,
        username: collaboratorUser.username,
        displayName: collaboratorUser.displayName,
        avatar: collaboratorUser.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to add collaborator", error });
  }
});

// Remove a collaborator - owner only
router.delete("/:id/collaborators/:userId", authenticateJWT, async (req, res) => {
  try {
    const note = await prisma.note.findUnique({ where: { id: req.params.id } });

    if (!note || note.userId !== req.user_id) {
      return res.status(404).json({ message: "Note not found or unauthorized" });
    }

    await prisma.noteCollaborator.deleteMany({
      where: { noteId: note.id, userId: req.params.userId },
    });

    res.status(200).json({ message: "Collaborator removed" });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove collaborator", error });
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
