import React, { useState, useEffect, useRef } from 'react';
import { IoPlay, IoPause } from "react-icons/io5";
import { FaClockRotateLeft } from "react-icons/fa6";
import { CiClock2 } from "react-icons/ci";

const Timer: React.FC = () => {
  const [minutes, setMinutes] = useState<number>(5);
  const [seconds, setSeconds] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSettingTime, setIsSettingTime] = useState<boolean>(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Convert minutes and seconds to total seconds
  const totalSeconds: number = minutes * 60 + seconds;

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsSettingTime(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const formatTime = (totalSecs: number): string => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = (): void => {
    if (isSettingTime) {
      setTimeLeft(totalSeconds);
      setIsSettingTime(false);
    }
    setIsRunning(true);
  };

  const handlePause = (): void => {
    setIsRunning(false);
  };

  const handleReset = (): void => {
    setIsRunning(false);
    setIsSettingTime(true);
    setTimeLeft(0);
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = Math.max(0, Math.min(59, parseInt(e.target.value) || 0));
    setMinutes(value);
  };

  const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = Math.max(0, Math.min(59, parseInt(e.target.value) || 0));
    setSeconds(value);
  };

  const getProgressPercentage = (): number => {
    if (totalSeconds === 0) return 0;
    return ((totalSeconds - timeLeft) / totalSeconds) * 100;
  };

  return (
    <div className="w-full h-full p-8 bg-[#282c34]">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <CiClock2 className="w-8 h-8 text-white mr-3" />
          <h1 className="text-2xl font-bold text-white">Timer</h1>
        </div>
        
        {/* Progress Circle */}
        <div className="relative w-48 h-48 mx-auto mb-6">
          <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-white"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - getProgressPercentage() / 100)}`}
              className={`transition-all duration-1000 ${
                timeLeft > 0 ? 'text-blue-500' : 'text-gray-300'
              }`}
            />
          </svg>
          
          {/* Timer display */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-mono font-bold text-indigo-600">
              {isSettingTime ? formatTime(totalSeconds) : formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </div>

      {/* Time Input Section */}
      {isSettingTime && (
        <div className="mb-6 p-4 bg-white/10 rounded-lg">
          <h3 className="text-sm font-medium text-white mb-3 text-center">Set Timer</h3>
          <div className="flex items-center justify-center space-x-4">
            <div className="flex flex-col items-center">
              <label className="text-xs text-white mb-1">Minutes</label>
              <input
                type="number"
                min="0"
                max="59"
                value={minutes}
                onChange={handleMinutesChange}
                className="w-16 px-2 py-1 text-center text-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <span className="text-2xl font-bold text-gray-400 mt-5">:</span>
            <div className="flex flex-col items-center">
              <label className="text-xs text-white mb-1">Seconds</label>
              <input
                type="number"
                min="0"
                max="59"
                value={seconds}
                onChange={handleSecondsChange}
                className="w-16 px-2 py-1 text-center border text-gray-50 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex justify-center space-x-3">
        {!isRunning ? (
          <button
            onClick={handleStart}
            disabled={isSettingTime && totalSeconds === 0}
            className="flex items-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 font-medium hover:cursor-pointer"
          >
            <IoPlay className="w-5 h-5 mr-2" />
            Start
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="flex items-center px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200 font-medium  hover:cursor-pointer"
          >
            <IoPause className="w-5 h-5 mr-2" />
            Pause
          </button>
        )}
        
        <button
          onClick={handleReset}
          className="flex items-center px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium hover:cursor-pointer"
        >
          <FaClockRotateLeft className="w-5 h-5 mr-2" />
          Reset
        </button>
      </div>

      {/* Timer Status */}
      <div className="mt-6 text-center">
        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
          timeLeft === 0 && !isSettingTime 
            ? 'bg-red-100 text-red-800' 
            : isRunning 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {timeLeft === 0 && !isSettingTime ? 'Time\'s Up!' : isRunning ? 'Running' : 'Paused'}
        </span>
      </div>
    </div>
  );
};

export default Timer;