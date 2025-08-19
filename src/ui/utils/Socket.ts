import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (ip: string) => {
  if (!socket || !socket.connected) {
    socket = io(ip, {
      transports: ["websocket"],
      reconnectionAttempts: 3,
    });
  }
  return socket;
};
