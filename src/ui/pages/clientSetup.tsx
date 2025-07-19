import React, { useState } from 'react';
import '../styles/ClientSetup.css';

const JoinRoom: React.FC = () => {
  const [roomId, setRoomId] = useState('');
  const [name, setName] = useState('');
  const [regNo, setRegNo] = useState('');

  const [errors, setErrors] = useState({
    roomId: '',
    name: '',
    regNo: '',
  });

  const validateForm = () => {
    const newErrors = { roomId: '', name: '', regNo: '' };
    let isValid = true;

    if (!roomId.trim()) {
      newErrors.roomId = 'Room ID is required';
      isValid = false;
    }

    if (!name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!regNo.trim()) {
      newErrors.regNo = 'Registration number is required';
      isValid = false;
    } else if (!/^\d+$/.test(regNo)) {
      newErrors.regNo = 'Registration number must be numeric';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleJoin = () => {
    if (!validateForm()) return;

    console.log({ roomId, name, regNo });
  };

  return (
    <div className="joinroom-container">
      <div className="logo-section">
        <div className="logo-dot"></div>
        <h1 className="logo-text">labX</h1>
      </div>

      <div className="joinroom-box">
        <div className="form-group">
          <label>Room ID:</label>
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Enter Room ID"
          />
          {errors.roomId && <p className="error-message">{errors.roomId}</p>}
        </div>

        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
          {errors.name && <p className="error-message">{errors.name}</p>}
        </div>

        <div className="form-group">
          <label>Reg. No:</label>
          <input
            type="text"
            value={regNo}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '' || /^\d+$/.test(value)) {
                setRegNo(value);
              }
            }}
            placeholder="Only numbers allowed"
            inputMode="numeric"
          />
          {errors.regNo && <p className="error-message">{errors.regNo}</p>}
        </div>

        <button className="join-button" onClick={handleJoin}>
          Join Room
        </button>
      </div>
    </div>
  );
};

export default JoinRoom;
