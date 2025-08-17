import React, { useState, useEffect, useRef } from "react";
import "../styles/Chat.css";
import { regNoStore } from "../stores/regNoStore";
import { ipStore } from "../stores/ipStore";
import { io, Socket } from "socket.io-client";
import { ChatStore } from "../stores/chatStore";

const ChatSidebar: React.FC = () => {

  const [input, setInput] = useState("");
  const messageEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  const messages = ChatStore((state) => state.message)

  useEffect(() => {
    const socket = io(ipStore.getState().ip);
    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (input.trim() && socketRef.current) {
      socketRef.current.emit("chatMessage", {
        roll: regNoStore.getState().regNo,
        message: input,
      });

      setInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  if(ipStore.getState().ip === ''){
      return(
        <div className="h-full flex justify-center items-center">
          <p className="text-white text-lg ">Join a room to download files</p>
        </div>
      )
  }

  return (
    <div className="chat-sidebar">
      <div className="chat-header">Orca Chat</div>

      <div className="chat-messages">
        {ChatStore.getState().message.map((msg) => (
          <div
            key={msg.id}
            className={`chat-message ${msg.isSelf ? "self" : "other"}`}
          >
            <div className="content">{msg.content}</div>
            {!msg.isSelf && <div className="sender">{msg.sender}</div>}
            <div className="timestamp">{msg.timestamp}</div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          // onPaste={(e) => e.preventDefault()}
        />
        <button onClick={handleSend}>➤</button>
      </div>
    </div>
  );
};

export default ChatSidebar;
