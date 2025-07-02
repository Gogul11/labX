import { FaFileCode } from "react-icons/fa6";
import { FaFolderClosed } from "react-icons/fa6";

type FileNode = {
    name: string;
    isDir: boolean;
    toogle : () => void
};

const Content = (props : FileNode) => {
    return (
        <div className='hover:bg-[#abb2bf]/10 cursor-pointer w-full '>
            <div 
                className="flex w-[80%] min-h-6 mx-2 gap-2 items-center py-2"
                onClick={props.toogle}
            >
                <div className="flex-shrink-0">
                    {props.isDir ? <FaFolderClosed size={20}/> : <FaFileCode size={20}/>} 
                </div>
                <span className={props.isDir ? "text-[#c678dd]" : "text-[#98c379]"}>{props.name}</span>
            </div>        
        </div>
    );
}

export default Content;
