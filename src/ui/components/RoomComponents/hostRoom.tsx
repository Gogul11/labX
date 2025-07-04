import { useState } from "react";

type Props = {
  onSubmit: (data: { name: string; allowChat: boolean }) => void;
};

const HostRoomForm: React.FC<Props> = ({ onSubmit }) => {
  const [name, setName] = useState("");
  const [allowChat, setAllowChat] = useState(true);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Room Name is required.");
      return;
    }
    setError("");
    const generatedRoomId = "ABC123";
    setRoomId(generatedRoomId);
    onSubmit({ name, allowChat });
  };

  const copyToClipboard = async () => {
    if (roomId) {
      await navigator.clipboard.writeText(roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="room-form">
      <input
        type="text"
        placeholder="Room Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={error ? "invalid" : ""}
        disabled={!!roomId}
      />
      {error && <span className="error-msg">{error}</span>}

      <label style={{ fontSize: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
        <input
          type="checkbox"
          checked={allowChat}
          onChange={(e) => setAllowChat(e.target.checked)}
          disabled={!!roomId}
        />
        Allow Chat
      </label>

      {!roomId && (
        <button type="submit">
          Host
        </button>
      )}

      {roomId && (
        <>
          <div className="room-hosted">
            <h3>Room Hosted Successfully!</h3>
            <p>Share this Room ID with others:</p>
            <div className="copy-room-id">
              <code className="room-id-display">{roomId}</code>
              <button onClick={copyToClipboard} className="copy-button">
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          <button type="button" className="start-btn">
            Start Room
          </button>
        </>
      )}
    </form>
  );
};

export default HostRoomForm;
