import React from 'react';
import {
  FiFile,
  FiFolder,
  FiServer,

} from 'react-icons/fi';
import { LiaUserFriendsSolid } from "react-icons/lia";

interface WelcomeScreenProps {}

const WelcomeScreen: React.FC<WelcomeScreenProps> = () => {
  const quickActions = [
    { icon: FiFile, label: 'New file'},
    { icon: FiFolder, label: 'Open folder'},
    { icon: FiServer, label: 'Host Room'},
    { icon: LiaUserFriendsSolid, label: 'Join Room'},
  ];

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-white flex">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        {/* ORCA Logo */}
        <div className="mb-12">
          <div className="text-8xl font-bold text-indigo-600 mb-4 tracking-wider">
            ORCA
          </div>
          <div className="text-center text-[#cccccc] text-lg">
            Coding made powerful
          </div>
        </div>

        {/* Action Sections */}
        <div className="w-full max-w-6xl flex justify-center">
          {/* Start Section */}
          <div className="">
            <h2 className="text-xl font-semibold mb-6 text-white text-center">Start</h2>
            <div className="space-y-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className="w-full flex items-center justify-between p-3 rounded-md hover:bg-[#2d2d30] transition-colors text-left group"
                >
                  <div className="flex items-center space-x-3">
                    <action.icon className="w-4 h-4 text-[#cccccc]" />
                    <span className="text-[#cccccc] group-hover:text-white">
                      {action.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Links */}
        <div className="mt-16 flex flex-wrap justify-center gap-6 text-sm">
          <button className="text-[#007acc] hover:text-[#0098ff] transition-colors">
            Show release notes
          </button>
          <button className="text-[#007acc] hover:text-[#0098ff] transition-colors">
            Privacy statement
          </button>
          <button className="text-[#007acc] hover:text-[#0098ff] transition-colors">
            License
          </button>
           <button className="text-[#007acc] hover:text-[#0098ff] transition-colors">
            About Us
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;