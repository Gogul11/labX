import React, { useState, useEffect, useRef } from "react";
import "../styles/Chat.css";
import { regNoStore } from "../stores/regNoStore";
import { ipStore } from "../stores/ipStore";
import { ChatStore } from "../stores/chatStore";
import type { Message } from "../types/types";
import { useSocket } from "../utils/soc";

const ChatSidebar: React.FC = () => {

  const [input, setInput] = useState("");
  const messageEndRef = useRef<HTMLDivElement>(null);

  const messages = ChatStore((state) => state.message)
  const setMessages = ChatStore((state) => state.setMessage)

  const socketRef = useSocket();

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (input.trim() && socketRef.current) {
      socketRef.current.emit("chatMessage", {
        roll: regNoStore.getState().regNo,
        message: input,
      });
      console.log(input)

      const now = new Date();
      const sendMsg: Message = {
        id: crypto.randomUUID(),
        sender: regNoStore.getState().regNo,
        content: input,
        timestamp: now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isSelf: true ,
      }

      setMessages(sendMsg)

      setInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  if(ipStore.getState().ip === ''){
      return(
        <div className="h-full flex justify-center items-center">
          <p className="text-white text-lg ">Join a room to Chat</p>
        </div>
      )
  }

  return (
    <div className="chat-sidebar">
      <div className="chat-header">Orca Chat</div>

      <div className="chat-messages">
        {messages.map((msg) => (
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
