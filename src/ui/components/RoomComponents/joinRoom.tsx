import React, { useState } from "react";
import { dirStore } from "../../stores/directoryStore";
import axios from 'axios'
import { ipStore } from "../../stores/ipStore";
import { roomIdStore } from "../../stores/roomIdStore";
import { regNoStore } from "../../stores/regNoStore";
import { getSocket } from "../../utils/Socket";

const JoinRoomForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    regNo: "",
    roomId: "",
  });

  const [ip, setIp] = useState("");
  const [portNo, setPortNo] = useState("");
  const [loader, setLoader] = useState<boolean>(false)
  const [touched, setTouched] = useState({
    name: false,
    regNo: false,
    roomId: false,
    ip: false,
    portNo: false,
  });

  const[joined, setJoined] = useState(false)
  const[commitLoader, setCommitLoader] = useState(false)
  const [submited, setSubmited] = useState(false)



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
      ipStore.getState().setIp(`http://${ip}:${portNo}`)

      const soc = getSocket(ipStore.getState().ip)
      
      soc.emit('join', formData)
      setLoader(true)

       soc.on('joined-response', () => {
          setLoader(false)
          setJoined(true)
          roomIdStore.getState().setRoomId(formData.roomId)
          regNoStore.getState().setRegNo(formData.regNo)
      })

      soc.on('join-failed', ({message}) => {
          setLoader(true)
          window.alert(message + "\nTry to Rejoin or Contact Teacher")
      })
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

  const handleEndSession = async() => {
    const soc = getSocket(ipStore.getState().ip)
    setJoined(false)
    setSubmited(false)
    roomIdStore.getState().roomId = ''
    soc.emit('end-session', {regNo : regNoStore.getState().regNo})
        setFormData({
      name : "",
      regNo : "",
      roomId : ""
    })
    setIp("")
    setPortNo("")
    ipStore.getState().setIp("");
    regNoStore.getState().setRegNo("");
  }

  return (
    <div>
      {!joined && roomIdStore.getState().roomId === ''  ? 
      
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
            {loader ? "Loading..." : "Join"}
          </button>
        </div>
      </form>
      :
          <div className="mt-4 px-4">
            {!submited && 
              <button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow transition duration-200 mt-4"
                onClick={async() => {
                            const submitRegNo = regNoStore.getState().regNo
                            if (submitRegNo.trim() === '') return;

                            setCommitLoader(true)

                            if(dirStore.getState().dir.trim() === ''){
                              window.alert("Choose the directory you worked before commit operations")
                              setCommitLoader(false)
                              return;
                            }


                            const checkStud = await axios.post(`${ipStore.getState().ip}/check`, {regNo : submitRegNo})
                            if(checkStud.data.success === 2){
                              window.alert("Checkyour register number or Try rejoining the server")
                              setCommitLoader(false)
                              return;
                            }
                            
                            const response = await window.electronApi.submitWorkSpace(dirStore.getState().dir, submitRegNo)
                            if (!response) {
                                console.log("Zipping failed");
                                window.alert("zipping failed or retry")
                                setCommitLoader(false);
                                return;
                            }
                            console.log("zipped at : ", response)

                            const zipBlob = await window.electronApi.readZipContent(response)
                            const zipBlobFile = new File([zipBlob], `${submitRegNo}.zip`, {
                              type : 'application/zip'
                            })

                            const commitFormData = new FormData()

                            commitFormData.append('zipfile', zipBlobFile)
                            commitFormData.append('regNo', submitRegNo)

                            try {
                              const fileUploadResponse = await axios.post(`${ipStore.getState().ip}/commit`, commitFormData)

                              if(fileUploadResponse.data.success){
                                window.alert(fileUploadResponse.data.message)
                                setSubmited(true)
                              }
                            } catch (error) {
                                console.error("Commit failed:", error);
                                window.alert("Commit failed. Check your connection or try again.");
                            }
                            
                            window.electronApi.deleteFileOrFolder(response);
                            
                            setCommitLoader(false)
                }}
              >
                {commitLoader ? 'commiting..do not close tab' : 'Commit your code base to teacher' }
              </button>
            }
            {submited && 
              <button 
                className="h-10 bg-orange-600 w-full my-4 rounded-2xl text-black"
                onClick={handleEndSession}
              >
                End session
              </button>
            }
          </div>

      }
    </div>
  );
};

export default JoinRoomForm;
