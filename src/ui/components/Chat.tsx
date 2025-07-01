import React, { useState, useEffect, useRef } from "react";
import "../styles/Chat.css";
import type { ChatSidebarProps, Message } from "../types/types";

const ChatSidebar: React.FC<ChatSidebarProps> = ({ username }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "Alice",
      content: "Hello, everyone!",
      isSelf: false,
    },
    {
      id: "2",
      sender: username,
      content: "Hi Alice",
      isSelf: true,
    },
  ]);
  const [input, setInput] = useState("");
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  return (
    <div className="chat-sidebar">
      <div className="chat-header">Chat</div>

      <div className="chat-messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-message ${msg.isSelf ? "self" : "other"}`}
          >
            {!msg.isSelf && <div className="sender">{msg.sender}</div>}
            <div className="content">{msg.content}</div>
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

        />
        <button>➤</button>
      </div>
    </div>
  );
};

export default ChatSidebar;
