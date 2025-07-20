import { useState } from "react";
import JoinRoomForm from "./joinRoom";
import HostRoomForm from "./hostRoom";
import './Room.css';

const Room: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"join" | "host">("join");

  return (
    <div className="room-container">
      <div className="tab-toggle">
        <button className={activeTab === "join" ? "active" : ""} onClick={() => setActiveTab("join")}>
          Join Room
        </button>
        <button className={activeTab === "host" ? "active" : ""} onClick={() => setActiveTab("host")}>
          Host Room
        </button>
      </div>

      <div className="form-section">
        {activeTab === "join" ? (
          <JoinRoomForm  />
        ) : (
          <HostRoomForm  />
        )}
      </div>
    </div>
  );
};

export default Room;
