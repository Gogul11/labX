import React from "react";
import { GiDolphin } from "react-icons/gi";

interface LoaderProps {
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="h-screen w-screen bg-black/70 fixed inset-0 z-50 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <GiDolphin size={50} className="text-indigo-500 animate-pulse" />
        <p className="text-white mt-3 text-lg font-medium whitespace-pre-line">
          {message ?? "Loading..."}
        </p>
      </div>
    </div>
  );
};

export default Loader;
