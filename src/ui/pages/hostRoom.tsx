import React, { useState } from 'react';
import '../styles/HostRoom.css';

const HostRoom: React.FC = () => {
  const [roomId] = useState('ABC123');
  const [roomName, setRoomName] = useState('');
  const [allowChat, setAllowChat] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(roomId);
    alert('Room ID copied!');
  };

  const handleStartRoom = () => {
    console.log('Starting room with settings:', { roomName, allowChat });
  };

  return (
    <div className="host-room-container">
      <div className="logo-row">
        <div className="logo-circle" />
        <h1 className="logo-text">labX</h1>
      </div>

      <div className="room-info">
        <p>
          Generated RoomID: <span className="room-id">{roomId}</span>
          <button className="copy-btn" onClick={handleCopy}>Copy</button>
        </p>

        <div className="input-row">
          <label htmlFor="roomName">Room name:</label>
          <input
            type="text"
            id="roomName"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
        </div>

        <div className="checkboxes">
          <label>
            <input
              type="checkbox"
              checked={allowChat}
              onChange={() => setAllowChat(!allowChat)}
            />
            Allow chat
          </label>


        </div>

        <button className="start-btn" onClick={handleStartRoom}>
          Start Room
        </button>
      </div>
    </div>
  );
};

export default HostRoom;
