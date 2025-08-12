import axios from "axios";
import React, { useEffect, useState } from "react";
import { FiDownload } from "react-icons/fi";
import { ipStore } from "../stores/ipStore";

interface FileItem {
  name: string;
  url: string;
}

const Download: React.FC = () => {

  const [files, setFiles] = useState<FileItem[]>([]);

  const handleGetFiles = async () => {
    const res = await axios.get(`${ipStore.getState().ip}/getFiles`)

    if(res.data.success){
      setFiles(res.data.files)
    }
    else{
      alert('No files')
    }
  }

  if(ipStore.getState().ip === ''){
    return(
      <div className="h-full flex justify-center items-center">
        <p className="text-white text-lg ">Join a room to download files</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 m-2">
      {/* File List */}
      <div className="w-full flex justify-center">
        {/* <button onClick={handleGetFiles}>Refresh</button> */}
        <div className="bg-indigo-700 w-[60%] h-10 rounded-lg hover:cursor-pointer flex justify-center items-center">
          <p className="text-white">Get Files</p>
        </div>
      </div>
      <hr className="border-t border-white/40" />
      {files.length > 0 ? (
        files.map((file, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col gap-2 justify-between items-center">
              <p
                className="font-semibold text-white max-w-[200px] truncate"
                title={file.name}
              >
                {file.name}
              </p>
              <a
                href={`${ipStore.getState().ip}${file.url}`}
                download
                target="_blank"
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition 
                  bg-blue-500 hover:bg-blue-600 text-white"    
                >
                <FiDownload /> Download
              </a>
            </div>
            {index < files.length - 1 && (
              <hr className="border-t border-white/40" />
            )}
          </React.Fragment>
        ))
      ) : (
        <div className="text-center text-gray-300 italic">
          No files available for download
        </div>
      )}
    </div>
  );
};

export default Download;
