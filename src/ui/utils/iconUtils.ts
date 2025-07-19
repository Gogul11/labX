import { FaCss3Alt, FaHtml5, FaReact, FaFileAlt } from 'react-icons/fa';
import { SiTypescript, SiJavascript } from 'react-icons/si';
import { VscJson } from 'react-icons/vsc';
import type { IconType } from 'react-icons';

export const getIconForExtension = (filename: string): IconType => {
  const ext = filename.split('.').pop()?.toLowerCase();

  switch (ext) {
    case 'tsx':
    case 'jsx':
      return FaReact;
    case 'ts':
    case 'd.ts':
      return SiTypescript;
    case 'js':
      return SiJavascript;
    case 'css':
      return FaCss3Alt;
    case 'html':
      return FaHtml5;
    case 'json':
      return VscJson;
    default:
      return FaFileAlt;
  }
};
