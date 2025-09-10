import axios from "axios";
import React, { useState } from "react";
import { FiDownload } from "react-icons/fi";
import { ipStore } from "../stores/ipStore";
import { currentStyle } from "../utils/styleChooser";

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
        <p 
          className="text-lg"
          style={{color : currentStyle('download.text')}}
        >Join a room to download files</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 m-2">
      {/* File List */}
      <div className="w-full flex justify-center">
        <div 
          onClick={handleGetFiles} 
          className="w-[60%] h-10 rounded-lg hover:cursor-pointer flex justify-center items-center"
          style={{backgroundColor : currentStyle('download.button.bg2')}}
        >
          <p style={{color : currentStyle('download.button.text')}}>Get Files</p>
        </div>
      </div>
      <hr className="border-t" style={{borderColor : currentStyle('download.border')}} />
      {files.length > 0 ? (
        files.map((file, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col gap-2 justify-between items-center">
              <p
                className="max-w-[70%] truncate"
                style={{color : currentStyle('download.text2')}}
                title={file.name}
              >
                {file.name}
              </p>
              <a
                href={`${ipStore.getState().ip}${file.url}`}
                download
                target="_blank"
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition"
                style={{
                  backgroundColor : currentStyle('download.button.bg'),
                  color : currentStyle('download.button.text')
                }}
                >
                <FiDownload /> Download
              </a>
            </div>
            {index < files.length - 1 && (
              <hr className="border-t" style={{borderColor : currentStyle('download.border')}} />
            )}
          </React.Fragment>
        ))
      ) : (
        <div 
          className="text-center"
          style={{color : currentStyle('download.text2')}}
        >
          No files available for download
        </div>
      )}
    </div>
  );
};

export default Download;
