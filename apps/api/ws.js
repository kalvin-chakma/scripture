const { WebSocketServer } = require("ws");
const jwt = require("jsonwebtoken");
const prisma = require("@scripture/db");
const { SECRET } = require("./middleware/auth");

// noteId -> Set of connected sockets currently viewing/editing that note
const rooms = new Map();

function joinRoom(noteId, ws) {
  if (!rooms.has(noteId)) rooms.set(noteId, new Set());
  rooms.get(noteId).add(ws);
}

function leaveRoom(noteId, ws) {
  const peers = rooms.get(noteId);
  if (!peers) return;
  peers.delete(ws);
  if (peers.size === 0) rooms.delete(noteId);
}

function broadcast(noteId, senderWs, payload) {
  const peers = rooms.get(noteId);
  if (!peers) return;
  const data = JSON.stringify(payload);
  for (const peer of peers) {
    if (peer !== senderWs && peer.readyState === peer.OPEN) {
      peer.send(data);
    }
  }
}

module.exports = function attachWebSocket(server) {
  const wss = new WebSocketServer({ server, path: "/ws" });

  wss.on("connection", async (ws, req) => {
    const url = new URL(req.url, "http://localhost");
    const token = url.searchParams.get("token");
    const noteId = url.searchParams.get("noteId");

    if (!token || !noteId) {
      return ws.close(4000, "Missing token or noteId");
    }

    let userId;
    try {
      userId = jwt.verify(token, SECRET).userID;
    } catch {
      return ws.close(4001, "Invalid token");
    }

    let note;
    try {
      note = await prisma.note.findUnique({
        where: { id: noteId },
        include: { collaborators: true },
      });
    } catch (error) {
      console.error("Failed to load note for websocket connection:", error);
      return ws.close(1011, "Server error");
    }

    const hasAccess =
      note &&
      (note.userId === userId ||
        note.collaborators.some((c) => c.userId === userId));

    if (!hasAccess) {
      return ws.close(4003, "Forbidden");
    }

    joinRoom(noteId, ws);

    ws.on("message", (raw) => {
      let msg;
      try {
        msg = JSON.parse(raw);
      } catch {
        return;
      }
      if (msg.type !== "update") return;

      broadcast(noteId, ws, {
        type: "update",
        title: msg.title,
        content: msg.content,
        fromUserId: userId,
      });
    });

    ws.on("close", () => leaveRoom(noteId, ws));
  });
};
