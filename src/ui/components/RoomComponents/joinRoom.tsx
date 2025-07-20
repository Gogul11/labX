import React, { useState } from "react";
import { io } from "socket.io-client";

const JoinRoomForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    regNo: "",
    roomId: "",
  });

  const [ip, setIp] = useState("");
  const [portNo, setPortNo] = useState("");

  const [touched, setTouched] = useState({
    name: false,
    regNo: false,
    roomId: false,
    ip: false,
    portNo: false,
  });

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleKeyDownNumberOnly = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowed = ["Backspace", "ArrowLeft", "ArrowRight", "Delete", "Tab"];
    if (!/[0-9]/.test(e.key) && !allowed.includes(e.key)) {
      e.preventDefault();
    }
  };

  const isNameValid = formData.name.trim() !== "";
  const isRegNoValid = /^\d+$/.test(formData.regNo);
  const isRoomIdValid = formData.roomId.trim() !== "";
  const isIPValid = /^(\d{1,3}\.){3}\d{1,3}$/.test(ip);
  const isPortNoValid = /^\d{1,5}$/.test(portNo) && +portNo <= 65535;

  const isFormValid =
    isNameValid && isRegNoValid && isRoomIdValid && isIPValid && isPortNoValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({
      name: true,
      regNo: true,
      roomId: true,
      ip: true,
      portNo: true,
    });

    if (isFormValid) {
      const soc = io(`http://${ip}:${portNo}`)
      soc.emit('join', formData)
    }
  };

  const renderField = (
    name: keyof typeof formData,
    label: string,
    isValid: boolean,
    isNumericOnly = false,
    errorMsg = "Required"
  ) => (
    <div>
      <label className="block mb-1 font-medium text-sm">{label}</label>
      <input
        type="text"
        value={formData[name]}
        onChange={(e) => handleChange(name, e.target.value)}
        onKeyDown={isNumericOnly ? handleKeyDownNumberOnly : undefined}
        className={`w-full px-3 py-2 border rounded ${
          !isValid && touched[name] ? "border-red-500" : "border-gray-300"
        }`}
      />
      {!isValid && touched[name] && (
        <div className="text-sm text-red-600 mt-1">{errorMsg}</div>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {renderField("name", "Name", isNameValid)}
      {renderField("regNo", "Registration Number", isRegNoValid, true, "Numbers only")}
      {renderField("roomId", "Room ID", isRoomIdValid)}

      {/* IP field */}
      <div>
        <label className="block mb-1 font-medium text-sm">IP Address</label>
        <input
          type="text"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          className={`w-full px-3 py-2 border rounded ${
            !isIPValid && touched.ip ? "border-red-500" : "border-gray-300"
          }`}
        />
        {!isIPValid && touched.ip && (
          <div className="text-sm text-red-600 mt-1">Invalid IP format</div>
        )}
      </div>

      {/* Port field */}
      <div>
        <label className="block mb-1 font-medium text-sm">Port Number</label>
        <input
          type="text"
          value={portNo}
          onChange={(e) => setPortNo(e.target.value)}
          onKeyDown={handleKeyDownNumberOnly}
          className={`w-full px-3 py-2 border rounded ${
            !isPortNoValid && touched.portNo ? "border-red-500" : "border-gray-300"
          }`}
        />
        {!isPortNoValid && touched.portNo && (
          <div className="text-sm text-red-600 mt-1">Max 65535</div>
        )}
      </div>

      <div className="flex justify-center items-center">
        <button
          type="submit"
          className="host-btn w-[80%]"
        >
          Join
        </button>
      </div>
    </form>
  );
};

export default JoinRoomForm;
