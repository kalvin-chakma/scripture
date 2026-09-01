import { useCallback, useEffect, useRef } from "react";
import { WS_URL } from "../services/api";

// Opens a live WebSocket connection for one note and relays edits between
// everyone currently viewing it. The server only relays messages - saving to
// the database still goes through the existing debounced REST update call.
export default function useNoteCollaboration(noteId, onRemoteUpdate) {
  const wsRef = useRef(null);
  const onRemoteUpdateRef = useRef(onRemoteUpdate);
  onRemoteUpdateRef.current = onRemoteUpdate;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!noteId || !token) return;

    const ws = new WebSocket(
      `${WS_URL}/ws?noteId=${noteId}&token=${encodeURIComponent(token)}`
    );
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === "update") {
          onRemoteUpdateRef.current?.(msg);
        }
      } catch {
        // ignore malformed messages
      }
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [noteId]);

  const broadcast = useCallback((patch) => {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "update", ...patch }));
    }
  }, []);

  return broadcast;
}
