import { FaFileCode } from "react-icons/fa6";
import { FaFolderClosed } from "react-icons/fa6";
import { currentPathStore } from "../../stores/currentPathStore";
import { sideBarStore } from "../../stores/sideBarStore";

type FileNode = {
    name: string;
    isDir: boolean;
    toogle : () => void;
    select : (path : {val : string, isDir : boolean}) => void,
    path : string
};

const Content = (props : FileNode) => {

    const selectedPath = currentPathStore((state) => state.setPath)
    const closeSideBar = sideBarStore((state) => state.toggle)

    return (
        <div className='hover:bg-[#abb2bf]/10 cursor-pointer w-full' 
            onClick={() => {
                    props.select({val : props.path, isDir : props.isDir})
                    !props.isDir && selectedPath(props.path)
                    !props.isDir && closeSideBar()
                }}
            onContextMenu={(e) => {
                if(e.button === 2)
                    props.select({val : props.path, isDir : props.isDir})
            }}
        >
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
