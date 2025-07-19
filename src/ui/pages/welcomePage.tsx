import type { FC } from 'react';

const WelcomeScreen: FC = () => {
  return (
    <div className="h-full w-full flex flex-col justify-center items-center bg-[#1e1e1e] text-white space-y-8">
      <img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSntiQh9c9M7WUnJ6sD9IVl5zgfi9khjFyNhg&s"
        alt="ORCA Logo"
        className="w-28 h-28"
      />
      <div className="welcome">Welcome to ORCA Editor</div>

      <div className="flex flex-col gap-4">
        <a href="#" className="links">
          New File
        </a>
        <a href="#" className="links">
          Open Folder
        </a>
        <a href="#" className="links">
          Help
        </a>
        <a href="#" className="links">
          About Us
        </a>
      </div>
    </div>
  );
};

export default WelcomeScreen;