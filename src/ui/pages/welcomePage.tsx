import React from 'react';
import {
  FiFolder,
  FiServer,

} from 'react-icons/fi';
import { LiaUserFriendsSolid } from "react-icons/lia";
import { dirStore } from '../stores/directoryStore';
import { selectedPathStore } from '../stores/selectedPathStore';
import { sideBarStore } from '../stores/sideBarStore';
import { GiDolphin } from 'react-icons/gi';
import { darkTheme, lightTheme } from '../utils/colors';
import { colorThemeStore } from '../stores/ThemeStore';

interface WelcomeScreenProps {}

const WelcomeScreen: React.FC<WelcomeScreenProps> = () => {
  const quickActions = [
    { 
      icon: FiFolder, 
      label: 'Open folder', 
      action : async () => {
          window.electronApi.openDir().then((d) => {
            if (d === '')
              return null;
            dirStore.getState().setDir(d)
            dirStore.getState().setInitialFetch()
            selectedPathStore.getState().setSelectedPath({ val: d, isDir: true })
          })
          !sideBarStore.getState().isOpen && sideBarStore.getState().toggle()
          sideBarStore.getState().setAcitveTab('files')
        }
    },
    { 
      icon: FiServer, 
      label: 'Host Room', 
      action : () => {
        !sideBarStore.getState().isOpen && sideBarStore.getState().toggle()
        sideBarStore.getState().setAcitveTab('connectHost')
      }
    },
    { 
      icon: LiaUserFriendsSolid, 
      label: 'Join Room',
      action : () => {
        !sideBarStore.getState().isOpen && sideBarStore.getState().toggle()
        sideBarStore.getState().setAcitveTab('connectClient')
      }
    },
  ];
  const theme = colorThemeStore((state) => state.theme)

  return (
    <div 
      className="min-h-screen flex"
      style={{backgroundColor : theme === "dark" ? darkTheme.welcome.bg : lightTheme.welcome.bg}}
    >
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        {/* ORCA Logo */}
        <div className="mb-12">
          <div 
            className="text-8xl font-bold mb-4 tracking-wider flex gap-4"
            style={{color : theme === "dark" ? darkTheme.welcome.link : lightTheme.welcome.link}}
          >
            ORCA
            <GiDolphin className='animate-pulse'/>
          </div>
          <div 
            className="text-center text-lg"
            style={{color : theme === "dark" ? darkTheme.welcome.pText2 : lightTheme.welcome.pText2}}
          >
            Coding made powerful
          </div>
        </div>

        {/* Action Sections */}
        <div className="w-full max-w-6xl flex justify-center">
          {/* Start Section */}
          <div className="">
            <h2 
              className="text-xl font-semibold mb-6 text-center"
              style={{color : theme === "dark" ? darkTheme.welcome.pText1 : lightTheme.welcome.pText1}}
            >Start</h2>
            <div className="space-y-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className="w-full flex items-center justify-between p-3 rounded-md transition-colors text-left group"
                  onClick={action.action}
                >
                  <div className="flex items-center space-x-3 hover:cursor-pointer">
                    <action.icon 
                      className="w-4 h-4" 
                      style={{color : theme === "dark" ? darkTheme.welcome.pText2 : lightTheme.welcome.pText2}}
                    />
                    <span
                      style={{color : theme === "dark" ? darkTheme.welcome.pText2 : lightTheme.welcome.pText2}}
                    >
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
          <button 
              className="transition-colors hover:cursor-pointer"
              style={{ color: darkTheme.welcome.link }}
              onMouseEnter={e => e.currentTarget.style.color = darkTheme.welcome.bLink}
              onMouseLeave={e => e.currentTarget.style.color = darkTheme.welcome.link}
          >
            Show release notes
          </button>
          <button   
              className="transition-colors hover:cursor-pointer"
              style={{ color: darkTheme.welcome.link }}
              onMouseEnter={e => e.currentTarget.style.color = darkTheme.welcome.bLink}
              onMouseLeave={e => e.currentTarget.style.color = darkTheme.welcome.link}
          >
            Privacy statement
          </button>
          <button
              className="transition-colors hover:cursor-pointer"
              style={{ color: darkTheme.welcome.link }}
              onMouseEnter={e => e.currentTarget.style.color = darkTheme.welcome.bLink}
              onMouseLeave={e => e.currentTarget.style.color = darkTheme.welcome.link}
          >
            License
          </button>
           <button
              className="transition-colors hover:cursor-pointer"
              style={{ color: darkTheme.welcome.link }}
              onMouseEnter={e => e.currentTarget.style.color = darkTheme.welcome.bLink}
              onMouseLeave={e => e.currentTarget.style.color = darkTheme.welcome.link}
           >
            About Us
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;