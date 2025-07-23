import { useState } from "react";
import { useNavigate } from "react-router";
import { ipStore } from "../../stores/ipStore";

const HostRoomForm: React.FC = () => {
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [port, setPort] = useState("");
  const [ip, setIp] = useState("");
  const [staffId, setStaffId] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isHosted, setIsHosted] = useState(false);
  const navigate = useNavigate();

  const [adminDir, setAdminDir] = useState("")

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) newErrors.name = "Room name is required.";
    if (!roomId.trim()) newErrors.roomId = "Room ID is required.";
    if (!port.trim() || !/^\d{4,5}$/.test(port)) newErrors.port = "Port must be 4-5 digits.";
    if (!staffId.trim()) newErrors.staffId = "Staff ID is required.";
    if (!ip.trim() || !/^(\d{1,3}\.){3}\d{1,3}$/.test(ip)) newErrors.Ip = "Valid IP address is required.";

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    ipStore.getState().setIp(`http://${ip}:${port}`)
    setErrors({});
    window.electronApi.startServer(roomId, name, port, adminDir);
    console.log(name, roomId, port, staffId)
    setIsHosted(true);
  };
  const handleStartRoom = () => {
    navigate("/hostDashboard");
  };

  return (
    <form onSubmit={handleSubmit} className="room-form">

       <div>
        <input
          type="text"
          placeholder="Staff ID"
          value={staffId}
          onChange={(e) => setStaffId(e.target.value)}
          className={errors.staffId ? "invalid" : ""}
          disabled={isHosted}
        />
        {errors.staffId && <span className="error-msg">{errors.staffId}</span>}
      </div>

      <div>
        <input
          type="text"
          placeholder="Room Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={errors.name ? "invalid" : ""}
          disabled={isHosted}
        />
        {errors.name && <span className="error-msg">{errors.name}</span>}
      </div>

      <div>
        <input
          type="text"
          placeholder="Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className={errors.roomId ? "invalid" : ""}
          disabled={isHosted}
        />
        {errors.roomId && <span className="error-msg">{errors.roomId}</span>}
      </div>

      <div>
        <input
          type="text"
          placeholder="Ip address"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          className={errors.Ip ? "invalid" : ""}
          disabled={isHosted}
        />
        {errors.Ip && <span className="error-msg">{errors.Ip}</span>}
      </div>

      <div>
        <input
          type="text"
          placeholder="Port Number"
          value={port}
          onChange={(e) => setPort(e.target.value)}
          className={errors.port ? "invalid" : ""}
          disabled={isHosted}
        />
        {errors.port && <span className="error-msg">{errors.port}</span>}
      </div>

      <div className="flex flex-col justify-center items-center gap-2 my-4">
        <div
          className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow transition duration-200"
          onClick={async () => {
            try {
              const dir = await window.electronApi.openDir();
              setAdminDir(dir);
            } catch (e) {
              console.error(e);
              window.alert(e);
            }
          }}
        >
          Select Directory
        </div>

        {adminDir ? (
          <p className="text-green-600 text-sm">📁 Directory : {'\n'} {adminDir}</p>
        ) : isHosted ? (
          <p className="text-yellow-500 text-sm">⚠️ Please select a directory before starting the room</p>
        ) : null}
      </div>


      {!isHosted ? (
        <button type="submit" className="host-btn">
          Host
        </button>
      ) : (
        <>
          <div className="room-hosted">
            <h3>Room Hosted Successfully!</h3>
            <p>Room ID: <code className="room-id-display">{roomId}</code></p>
            <p>The server is running on port : <code className="room-id-display">{port}</code></p>      
          </div>

          <button type="button" className="start-btn" onClick={handleStartRoom}>
            Start Room
          </button>
        </>
      )}
    </form>
  );
};

export default HostRoomForm;
