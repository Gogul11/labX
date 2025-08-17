import { HashRouter, Routes, Route } from 'react-router';
import EditorPage from './pages/editorPage';
import HostDashboard from './components/HostDashboard/hostDashboard';
import { useRef, useEffect } from 'react';
import { ChatStore } from './stores/chatStore';
import { io, Socket } from "socket.io-client";
import { ipStore } from './stores/ipStore';
import type {  Message } from "./types/types";
import { regNoStore } from './stores/regNoStore';


function AppContent() {

    const socketRef = useRef<Socket | null>(null);
    const setMessages = ChatStore((state) => state.setMessage)

    useEffect(() => {
      const socket = io(ipStore.getState().ip);
      socketRef.current = socket;
  
      socket.on("messageReply", (msg, roll) => {
        console.log(msg, roll)
        const now = new Date();
        const repMsg: Message = {
          id: crypto.randomUUID(),
          sender: roll,
          content: msg,
          timestamp: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isSelf: roll === regNoStore.getState().regNo ? true : false,
        };
        setMessages(repMsg);
      });
  
      return () => {
        socket.disconnect();
      };
    }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<EditorPage />} />
        <Route path="/hostDashboard" element={<HostDashboard />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}

export default App;
