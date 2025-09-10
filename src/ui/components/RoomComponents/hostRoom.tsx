import { useState } from "react";
import { useNavigate } from "react-router";
import { ipStore } from "../../stores/ipStore";
import { roomIdStore } from "../../stores/roomIdStore";
import { roomNameStore } from "../../stores/roomNameStore";
import { adminStore } from "../../stores/hostDirStore";
import { currentStyle } from "../../utils/styleChooser";

const HostRoomForm: React.FC = () => {
	
	const [name, setName] = useState("");
	const [roomId, setRoomId] = useState("");
	const [port, setPort] = useState("");
	const [ip, setIp] = useState("");
	const [staffId, setStaffId] = useState("");
	const [errors, setErrors] = useState<{ [key: string]: string }>({});
	const [isHosted, setIsHosted] = useState(false);
	const navigate = useNavigate();

	const adminDir = adminStore((state) => state.dir);
	const setAdminDir = adminStore((state) => state.setDir);

	const validate = () => {
		const newErrors: { [key: string]: string } = {};
		if (!name.trim()) newErrors.name = "Room name is required.";
		if (!roomId.trim()) newErrors.roomId = "Room ID is required.";
		if (!port.trim() || !/^\d{4,5}$/.test(port))
			newErrors.port = "Port must be 4-5 digits.";
		if (!staffId.trim()) newErrors.staffId = "Staff ID is required.";
		if (!ip.trim() || !/^(\d{1,3}\.){3}\d{1,3}$/.test(ip))
			newErrors.ip = "Valid IP address is required.";
		if(adminDir.trim() === '') newErrors.dir = "Please Select Directory!"
		return newErrors;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const validationErrors = validate();
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}
		ipStore.getState().setIp(`http://${ip}:${port}`);
		setErrors({});
		window.electronApi.startServer(roomId, name, port, adminDir);
		setIsHosted(true);
		roomIdStore.getState().setRoomId(roomId);
		roomNameStore.getState().setRoomName(name);
	};

	const handleStartRoom = () => {
		navigate("/hostDashboard");
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-5">
			<div>
				<label 
					className="block mb-1 text-sm font-medium"
					style = {{color : currentStyle('hostRoom.label')}}
				>
					Staff Id
				</label>
				<input
					type="text"
					value={staffId}
					onChange={(e) => setStaffId(e.target.value)}
					disabled={isHosted}
					className="w-full rounded-md px-3 py-2 border outline-none"
					style={{
						borderColor : errors.staffId ? currentStyle('hostRoom.errorBorder') : currentStyle('hostRoom.border'),
						color : currentStyle('hostRoom.text'),
						backgroundColor : currentStyle('hostRoom.inputBg')
					}}
				/>
				{errors.staffId && (
					<span 
						className="text-sm mt-1"
						style={{color : currentStyle('hostRoom.error')}}
					>{errors.staffId}</span>
				)}
			</div>

			<div>
				<label 
					className="block mb-1 text-sm font-medium"
					style = {{color : currentStyle('hostRoom.label')}}
				>
					Room Name
				</label>
				<input
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
					disabled={isHosted}
					className="w-full rounded-md px-3 py-2 border outline-none"
					style={{
						borderColor : errors.name ? currentStyle('hostRoom.errorBorder') : currentStyle('hostRoom.border'),
						color : currentStyle('hostRoom.text'),
						backgroundColor : currentStyle('hostRoom.inputBg')
					}}
				/>
				{errors.name && (
					<span
						className="text-sm mt-1"
						style={{color : currentStyle('hostRoom.error')}}
					>{errors.name}</span>
				)}
			</div>

			<div>
				<label 
					className="block mb-1 text-sm font-medium"
					style = {{color : currentStyle('hostRoom.label')}}
				>
					Room Id
				</label>
				<input
					type="text"
					value={roomId}
					onChange={(e) => setRoomId(e.target.value)}
					disabled={isHosted}
					className="w-full rounded-md px-3 py-2 border outline-none"
					style={{
						borderColor : errors.roomId ? currentStyle('hostRoom.errorBorder') : currentStyle('hostRoom.border'),
						color : currentStyle('hostRoom.text'),
						backgroundColor : currentStyle('hostRoom.inputBg')
					}}
				/>
				{errors.roomId && (
					<span 
						className="text-sm mt-1"
						style={{color : currentStyle('hostRoom.error')}}
					>{errors.roomId}</span>
				)}
			</div>

			<div>
				<label 
					className="block mb-1 text-sm font-medium"
					style = {{color : currentStyle('hostRoom.label')}}
				>
					Ip address
				</label>
				<input
					type="text"
					value={ip}
					onChange={(e) => setIp(e.target.value)}
					disabled={isHosted}
					className="w-full rounded-md px-3 py-2 border outline-none"
					style={{
						borderColor : errors.ip ? currentStyle('hostRoom.errorBorder') : currentStyle('hostRoom.border'),
						color : currentStyle('hostRoom.text'),
						backgroundColor : currentStyle('hostRoom.inputBg')
					}}
				/>
				{errors.ip && (
					<span
						className="text-sm mt-1"
						style={{color : currentStyle('hostRoom.error')}}
					>{errors.ip}</span>
				)}
			</div>

			<div>
				<label 
					className="block mb-1 text-sm font-medium"
					style = {{color : currentStyle('hostRoom.label')}}
				>
					Port Number
				</label>
				<input
					type="text"
					value={port}
					onChange={(e) => setPort(e.target.value)}
					disabled={isHosted}
					className="w-full rounded-md px-3 py-2 border outline-none"
					style={{
						borderColor : errors.port ? currentStyle('hostRoom.errorBorder') : currentStyle('hostRoom.border'),
						color : currentStyle('hostRoom.text'),
						backgroundColor : currentStyle('hostRoom.inputBg')
					}}
				/>
				{errors.port && (
					<span
						className="text-sm mt-1"
						style={{color : currentStyle('hostRoom.error')}}
					>{errors.port}</span>
				)}
			</div>
			

			<div className="flex flex-col justify-center items-center gap-2 my-4">
				<div
					className="px-4 py-2 rounded-md w-[80%] transition hover:cursor-pointer text-center"
					style={{
						color : currentStyle('hostRoom.button.text'),
						backgroundColor : errors.dir ? currentStyle('hostRoom.errorButton'):  currentStyle('hostRoom.button.bg')
					}}
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

				{adminDir && (
					<p className="font-semibold text-sm text-center">
						Directory: <br /> {adminDir}
					</p>
				)}
				{errors.dir && (
					<span
						className="text-sm mt-1"
						style={{color : currentStyle('hostRoom.error')}}
					>{errors.dir}</span>
				)}
			</div>

			{!isHosted ? (
				<div className="flex w-full justify-center">
					<button
						type="submit"
						className="px-4 py-2 rounded-md w-[80%] transition hover:cursor-pointer"
						style={{
							color : currentStyle('hostRoom.button.text'),
							backgroundColor : currentStyle('hostRoom.button.bg')
						}}
					> Host
					</button>
				</div>
			) : (
				<div className="flex w-full justify-center">
					<button
						type="button"
						onClick={handleStartRoom}
						className="px-4 py-2 rounded-md w-[80%] transition hover:cursor-pointer"
						style={{
							color : currentStyle('hostRoom.button.text'),
							backgroundColor : currentStyle('hostRoom.button.bg')
						}}
					>
						Start Room
					</button>
				</div>
		)}
		</form>
	);
};

export default HostRoomForm;
