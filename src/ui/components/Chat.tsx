import React, { useState, useEffect, useRef } from "react";
import "../styles/Chat.css";
import type { ChatSidebarProps, Message } from "../types/types";

const ChatSidebar: React.FC<ChatSidebarProps> = ({ username }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "Gogul",
      content: "Hey da",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSelf: false,
    },
    {
      id: "2",
      sender: username,
      content: "Sollu da",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSelf: true,
    },
  ]);
  const [input, setInput] = useState("");
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      const now = new Date();
      const newMsg: Message = {
        id: crypto.randomUUID(),
        sender: username,
        content: input,
        timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSelf: true,
      };
      setMessages((prev) => [...prev, newMsg]);
      setInput("");

      //emit to socket backend here
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="chat-sidebar">
      <div className="chat-header"> Chat</div>

      <div className="chat-messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-message ${msg.isSelf ? "self" : "other"}`}
          >
            {!msg.isSelf && <div className="sender">{msg.sender}</div>}
            <div className="content">{msg.content}</div>
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
          onPaste={(e) => e.preventDefault()}
        />
        <button onClick={handleSend}>➤</button>
      </div>
    </div>
  );
};

export default ChatSidebar;
