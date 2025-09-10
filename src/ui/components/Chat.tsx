import React, { useState, useEffect, useRef } from "react";
import { regNoStore } from "../stores/regNoStore";
import { ipStore } from "../stores/ipStore";
import { ChatStore } from "../stores/chatStore";
import type { Message } from "../types/types";
import { useSocket } from "../utils/soc";
import { currentStyle } from "../utils/styleChooser";
import { GiDolphin } from "react-icons/gi";

const ChatSidebar: React.FC = () => {
  const [input, setInput] = useState("");
  const messageEndRef = useRef<HTMLDivElement>(null);

  const messages = ChatStore((state) => state.message);
  const setMessages = ChatStore((state) => state.setMessage);

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

      const now = new Date();
      const sendMsg: Message = {
        id: crypto.randomUUID(),
        sender: regNoStore.getState().regNo,
        content: input,
        timestamp: now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isSelf: true,
      };

      setMessages(sendMsg);
      setInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  if (ipStore.getState().ip === "") {
    return (
      <div className="h-full flex justify-center items-center">
        <p className="text-lg" style={{ color: currentStyle("chat.text") }}>
          Join a room to Chat
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">

      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-[80%] break-words px-3 py-2 rounded-2xl leading-relaxed ${
              msg.isSelf
                ? "self-end text-right"
                : "self-start text-left"
            }`}
            style={{
              color : currentStyle('chat.text'),
              backgroundColor : msg.isSelf ? currentStyle('chat.Chatbg1') : currentStyle('chat.Chatbg2')
            }}
          >
            {!msg.isSelf && (
              <div 
                className="text-xs mb-1"
                style={{color : currentStyle('chat.text2')}}
              >
                {msg.sender}
              </div>
            )}
            <div>{msg.content}</div>
            <div 
              className="text-[0.65rem] mt-1"
              style={{color : currentStyle('chat.text2')}}
            >
              {msg.timestamp}
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      {/* Input */}
      <div 
        className="flex p-2 border-t"
        style={{borderColor : currentStyle('chat.border')}}
      >
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 px-3 py-2 text-sm rounded-l-md outline-none"
          style={{
            backgroundColor : currentStyle('chat.inputBg'),
            color : currentStyle('chat.text2')
          }}
        />
        <button
          onClick={handleSend}
          className="px-4 rounded-r-md transition cursor-pointer"
          style={{
            color : currentStyle('chat.text'),
            backgroundColor : currentStyle('chat.sendBg')
          }}
        >
          <GiDolphin/>
        </button>
      </div>
    </div>
  );
};

export default ChatSidebar;
