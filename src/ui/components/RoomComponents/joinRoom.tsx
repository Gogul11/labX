import React, { useState, useEffect } from "react";
import "./Room.css"; 

type Props = {
  onSubmit: (data: { name: string; regNo: number; roomId: string }) => void;
};

const JoinRoomForm: React.FC<Props> = ({ onSubmit }) => {
  const [name, setName] = useState("");
  const [regNo, setRegNo] = useState("");
  const [roomId, setRoomId] = useState("");
  const [touched, setTouched] = useState({
    name: false,
    regNo: false,
    roomId: false,
  });

  const isNameValid = name.trim() !== "";
  const isRegNoValid = /^\d+$/.test(regNo);
  const isRoomIdValid = roomId.trim() !== "";
  const isFormValid = isNameValid && isRegNoValid && isRoomIdValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      onSubmit({ name, regNo: Number(regNo), roomId });
    }
  };

  const handleRegNoKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = [
      "Backspace",
      "ArrowLeft",
      "ArrowRight",
      "Delete",
      "Tab",
    ];
    if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="room-form">
      <div>
        <input
          className={!isNameValid && touched.name ? "invalid" : ""}
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => setTouched({ ...touched, name: true })}
        />
        {!isNameValid && touched.name && <div className="error-msg">Required</div>}
      </div>

      <div>
        <input
          className={!isRegNoValid && touched.regNo ? "invalid" : ""}
          placeholder="Registration Number"
          value={regNo}
          onKeyDown={handleRegNoKeyDown}
          onChange={(e) => setRegNo(e.target.value)}
          onBlur={() => setTouched({ ...touched, regNo: true })}
        />
        {!isRegNoValid && touched.regNo && <div className="error-msg">Numbers only</div>}
      </div>

      <div>
        <input
          className={!isRoomIdValid && touched.roomId ? "invalid" : ""}
          placeholder="Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          onBlur={() => setTouched({ ...touched, roomId: true })}
        />
        {!isRoomIdValid && touched.roomId && <div className="error-msg">Required</div>}
      </div>

      <button type="submit" disabled={!isFormValid}>
        Join
      </button>
    </form>
  );
};

export default JoinRoomForm;
