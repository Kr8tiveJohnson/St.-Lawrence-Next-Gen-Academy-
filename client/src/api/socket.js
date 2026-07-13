import { io } from "socket.io-client";

let socket = null;

/**
 * Returns a singleton Socket.io instance.
 * The socket is created lazily on first call and reused thereafter.
 * Reads the auth token from localStorage so it is always fresh.
 */
export function getSocket() {
  if (!socket) {
    socket = io("http://localhost:5000", {
      autoConnect: false,
      auth: {
        token: localStorage.getItem("sl_token") || localStorage.getItem("token"),
      },
    });
  }
  return socket;
}
