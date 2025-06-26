import React, { useState } from 'react';
import '../styles/ClientSetup.css';

const JoinRoom: React.FC = () => {
  const [roomId, setRoomId] = useState('');
  const [name, setName] = useState('');
  const [regNo, setRegNo] = useState('');

  const handleJoin = () => {
    if (!roomId || !name || !regNo) {
      alert('Please fill all fields');
      return;
    }
    console.log({ roomId, name, regNo });
    // Handle join room logic
  };

  return (
    <div className="joinroom-container">
        <div className="logo-section">
          <div className="logo-dot"></div>
          <h1 className="logo-text">labX</h1>
        </div>
      <div className="joinroom-box">

        {/* Input Fields */}
        <div className="form-group">
          <label>Room ID:</label>
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Reg. No:</label>
          <input
            type="text"
            value={regNo}
            onChange={(e) => setRegNo(e.target.value)}
          />
        </div>

        <button className="join-button" onClick={handleJoin}>
          Join Room
        </button>
      </div>
    </div>
  );
};

export default JoinRoom;
