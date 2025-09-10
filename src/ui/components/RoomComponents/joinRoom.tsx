import React, { useState } from "react";
import { dirStore } from "../../stores/directoryStore";
import axios from "axios";
import { ipStore } from "../../stores/ipStore";
import { roomIdStore } from "../../stores/roomIdStore";
import { regNoStore } from "../../stores/regNoStore";
import { getSocket } from "../../utils/Socket";
import Loader from "../loader";
import { currentStyle } from "../../utils/styleChooser";

const JoinRoomForm: React.FC = () => {
	
	const [formData, setFormData] = useState({
		name: "",
		regNo: "",
		roomId: "",
	});

	const [ip, setIp] = useState("");
	const [portNo, setPortNo] = useState("");
	const [loader, setLoader] = useState<boolean>(false);
	const [touched, setTouched] = useState({
		name: false,
		regNo: false,
		roomId: false,
		ip: false,
		portNo: false,
	});

	const [joined, setJoined] = useState(false);
	const [commitLoader, setCommitLoader] = useState(false);
	const [submited, setSubmited] = useState(false);

	const handleChange = (field: string, value: string) => {
		setFormData({ ...formData, [field]: value });
	};

	const handleKeyDownNumberOnly = (
		e: React.KeyboardEvent<HTMLInputElement>
	) => {
		const allowed = ["Backspace", "ArrowLeft", "ArrowRight", "Delete", "Tab"];
		if (!/[0-9]/.test(e.key) && !allowed.includes(e.key)) {
			e.preventDefault();
		}
	};

	const isNameValid = formData.name.trim() !== "";
	const isRegNoValid = formData.regNo.trim() !== "";
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
		ipStore.getState().setIp(`http://${ip}:${portNo}`);
		const soc = getSocket(ipStore.getState().ip);

		soc.emit("join", formData);
		setLoader(true);

		soc.on("joined-response", () => {
			setLoader(false);
			setJoined(true);
			roomIdStore.getState().setRoomId(formData.roomId);
			regNoStore.getState().setRegNo(formData.regNo);
		});

		soc.on("rejoin-failed", ({ message }) => {
			setLoader(true);
			window.alert(message);
			setLoader(false);
		});

		soc.on("join-failed", ({ message }) => {
			setLoader(true);
			window.alert(message + "\nTry to Rejoin or Contact Teacher");
		});
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
		<label 
			className="block mb-1 text-sm font-medium"
			style = {{color : currentStyle('joinRoom.label')}}
		>
			{label}
		</label>
		<input
			type="text"
			value={formData[name]}
			onChange={(e) => handleChange(name, e.target.value)}
			onKeyDown={isNumericOnly ? handleKeyDownNumberOnly : undefined}
			className="w-full rounded-md px-3 py-2 text-base border outline-none"
			style={{
				borderColor : !isValid && touched[name] ? currentStyle('joinRoom.errorBorder') : currentStyle('joinRoom.border'),
				color : currentStyle('joinRoom.text'),
				backgroundColor : currentStyle('joinRoom.inputBg')
			}}
		/>
		{!isValid && touched[name] && (
			<div 
				className="text-sm mt-1"
				style={{color : currentStyle('joinRoom.error')}}
			>{errorMsg}</div>
		)}
		</div>
	);

	const handleEndSession = async () => {
		const soc = getSocket(ipStore.getState().ip);
		setJoined(false);
		setSubmited(false);
		roomIdStore.getState().roomId = "";
		soc.emit("end-session", { regNo: regNoStore.getState().regNo });
		setFormData({
			name: "",
			regNo: "",
			roomId: "",
		});
		setIp("");
		setPortNo("");
		ipStore.getState().setIp("");
		regNoStore.getState().setRegNo("");
	};

	return (
		<div>
			{!joined && roomIdStore.getState().roomId === "" ? (
				<form onSubmit={handleSubmit} className="flex flex-col gap-5">
					{renderField("name", "Name", isNameValid)}
					{renderField(
						"regNo",
						"Registration Number",
						isRegNoValid,
						true,
						"Numbers only"
					)}
					{renderField("roomId", "Room ID", isRoomIdValid)}

					{/* IP field */}
					<div>
						<label 
							className="block mb-1 text-sm font-medium"
							style = {{color : currentStyle('joinRoom.label')}}
						>
							IP Address
						</label>
						<input
							type="text"
							value={ip}
							onChange={(e) => setIp(e.target.value)}
							className="w-full rounded-md px-3 py-2 text-base border outline-none"
							style={{
								borderColor : !isIPValid && touched.ip ? currentStyle('joinRoom.errorBorder') : currentStyle('joinRoom.border'),
								color : currentStyle('joinRoom.text'),
								backgroundColor : currentStyle('joinRoom.inputBg')
							}}
						/>
						{!isIPValid && touched.ip && (
							<div 
								className="text-sm mt-1"
								style={{color : currentStyle('joinRoom.error')}}
							>Invalid IP format</div>
						)}
					</div>

					{/* Port field */}
					<div>
						<label 
							className="block mb-1 text-sm font-medium"
							style = {{color : currentStyle('joinRoom.label')}}
						>
							Port Number
						</label>
						<input
							type="text"
							value={portNo}
							onChange={(e) => setPortNo(e.target.value)}
							onKeyDown={handleKeyDownNumberOnly}
							className="w-full rounded-md px-3 py-2 text-base border outline-none"
							style={{
								borderColor : !isPortNoValid && touched.portNo ? currentStyle('joinRoom.errorBorder') : currentStyle('joinRoom.border'),
								color : currentStyle('joinRoom.text'),
								backgroundColor : currentStyle('joinRoom.inputBg')
							}}
						/>
						{!isPortNoValid && touched.portNo && (
							<div 
								className="text-sm mt-1"
								style={{color : currentStyle('joinRoom.error')}}
							>Max 65535</div>
						)}
					</div>

					<div className="flex justify-center items-center">
						<button
							type="submit"
							className="px-4 py-2 rounded-md w-[80%] transition hover:cursor-pointer"
							style={{
								color : currentStyle('joinRoom.button.text'),
								backgroundColor : currentStyle('joinRoom.button.bg')
							}}
						>
							{loader ? "Joining.." : "Join"}
						</button>
						{loader && <Loader message="Joining.." />}
					</div>
				</form>
			) : (
				<div className="mt-4 px-4">
				{!submited && (
					<>
					<button
						className="w-full py-2 px-4 rounded-md  hover:cursor-pointer mt-4"
						style={{
							color : currentStyle('joinRoom.button.text'),
							backgroundColor : currentStyle('joinRoom.button.bg')
						}}
						onClick={
							async () => {
								const submitRegNo = regNoStore.getState().regNo;
								if (submitRegNo.trim() === "") return;

								setCommitLoader(true);

								if (dirStore.getState().dir.trim() === "") {
									window.alert(
									"Choose the directory you worked before commit operations"
									);
									setCommitLoader(false);
									return;
								}

								const checkStud = await axios.post(
									`${ipStore.getState().ip}/check`,
									{ regNo: submitRegNo }
								);
								if (checkStud.data.success === 2) {
									window.alert(
									"Check your register number or Try rejoining the server"
									);
									setCommitLoader(false);
									return;
								}

								const response = await window.electronApi.submitWorkSpace(
									dirStore.getState().dir,
									submitRegNo
								);
								if (!response) {
									console.log("Zipping failed");
									setCommitLoader(false);
									window.alert("zipping failed or retry");
									return;
								}
								console.log("zipped at : ", response);

								const zipBlob = await window.electronApi.readZipContent(
									response
								);
								const zipBlobFile = new File([zipBlob], `${submitRegNo}.zip`, {
									type: "application/zip",
								});

								const commitFormData = new FormData();
								commitFormData.append("zipfile", zipBlobFile);
								commitFormData.append("regNo", submitRegNo);

								try {
									const fileUploadResponse = await axios.post(
									`${ipStore.getState().ip}/commit`,
									commitFormData
									);

									if (fileUploadResponse.data.success) {
									window.alert(fileUploadResponse.data.message);
									setSubmited(true);
									}
								} catch (error) {
									console.error("Commit failed:", error);
									window.alert(
									"Commit failed. Check your connection or try again."
									);
								}

								window.electronApi.deleteFileOrFolder(response);
								setCommitLoader(false);
							}
						}
					>
						{commitLoader
						? "committing.. Do not close tab"
						: "Commit your code base to teacher"}
					</button>
					{commitLoader && (
						<Loader message={`committing..\nDo not close tab`} />
					)}
					</>
				)}
				{submited && (
					<button
						className="w-full py-2 px-4 rounded-md mt-4"
						style={{
							color : currentStyle('joinRoom.button.text'),
							backgroundColor : currentStyle('joinRoom.endSession')
						}}
						onClick={handleEndSession}
					>
						End session
					</button>
				)}
				</div>
			)}
		</div>
);
};

export default JoinRoomForm;
