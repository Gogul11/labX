// hooks/useSocket.ts
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { ipStore } from "../stores/ipStore";
import { regNoStore } from "../stores/regNoStore";
import { ChatStore } from "../stores/chatStore";
import type { Message } from "../types/types";
import { getSocket } from "./Socket";

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const setMessages = ChatStore((state) => state.setMessage);
  const messages = ChatStore((state) => state.message)
  
  useEffect(() => {
    const ip = ipStore.getState().ip;
    if (!ip) return;

    const socket = getSocket(ip);
    socketRef.current = socket;
    socket.on("messageReply", (msg, roll) => {
      const now = new Date();
      const repMsg: Message = {
        id: crypto.randomUUID(),
        sender: roll,
        content: msg,
        timestamp: now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isSelf: false,
      };
      setMessages(repMsg);
      console.log(repMsg, regNoStore.getState().regNo)
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [ipStore.getState().ip, messages]);

  return socketRef;
}
