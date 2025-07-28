import { useEffect } from 'react';
import LabXEditor from '../components/editor';
import OpenedEditors from '../components/opened/openedEditors';
import WelcomeScreen from './welcomePage';
import { sideBarStore } from '../stores/sideBarStore';
import { currentPathStore } from '../stores/currentPathStore';
import { EditorMapsStore } from '../stores/editorsMap';
import { GiDolphin } from "react-icons/gi";
import { ActivePathStore } from '../stores/activePathStore';
import { ModifiedFileStore } from '../stores/modifiedFileStore';
import SideBar from './sideBar';
import { welcomePageStore } from '../stores/welcomePageStore';

const EditorPage = () => {


    //stores
    const toogleSideBar = sideBarStore((state) => state.toggle)
    const isSideBarOpen = sideBarStore((state) => state.isOpen)

    //selectedPath store 
    const selectedPath = currentPathStore((state) => state.path)

    //Editor related
    const openedEditors = EditorMapsStore((state) => state.openedEditors)
    const setOpenedEditors = EditorMapsStore((state) => state.setOpenedEditors)
    const toogleEditors = EditorMapsStore((state) => state.toogleEditors)


    useEffect(() => {
        (async () => {
            const res: { data: string, ext: string, fileName: string } = await window.electronApi.openFile(selectedPath);
            console.log(selectedPath)
            setOpenedEditors(selectedPath, true, res.data, res.ext)
            toogleEditors(selectedPath)
        })();
    }, [selectedPath]);

    useEffect(() => {
        window.electronApi.saveTrigger(() => {
            const saveFile = async () => {
                const path = ActivePathStore.getState().path;
                const editors = EditorMapsStore.getState().openedEditors;

                const entry = editors[path];

                if (entry) {
                    const res: boolean = await window.electronApi.saveSelectedFile(path, entry.data);
                    console.log(path, entry);

                    if (res) console.log("success");
                    else console.log("fail");
                }
            };

            saveFile();
        });
    }, []); // only once on mount


    useEffect(() => {
        window.electronApi.saveAllTrigger(() => {
            if (ModifiedFileStore.getState().files.length <= 0) {
                window.alert("Nothing to save for now")
                return;
            }
            const saveAllFile = async () => {
                const openedFiles = ModifiedFileStore.getState().files
                for (const val in openedFiles) {
                    console.log(openedFiles[val])
                    const res: boolean = await window.electronApi.saveSelectedFile(openedFiles[val], EditorMapsStore.getState().openedEditors[openedFiles[val]].data);
                    if (res) console.log("success");
                    else console.log("fail");
                }
                ModifiedFileStore.getState().clearFiles()
            }


            saveAllFile()
        })
    }, [])

    return (
        <div className="flex h-screen w-screen">
            <div className={`h-[96%] ${isSideBarOpen && 'w-[20%]'}`}>
                {isSideBarOpen && <SideBar onClose={toogleSideBar} />}  
            </div>

            {welcomePageStore.getState().isOpen ?
                <div className={`h-[96%] ${isSideBarOpen ? 'w-[80%]' : 'w-full'}`}>
                    <WelcomeScreen />
                </div>
                : (
                    Object.entries(openedEditors).map(([path, vals]) => (
                        vals.isOpen &&
                        <div className={`h-[96%] ${isSideBarOpen ? 'w-[80%]' : 'w-full'}`} key={path}> 
                            <LabXEditor
                                theme="vs-dark"
                                value={vals.data}
                                ext={vals.ext}
                                path={path}
                            />
                        </div>
                    ))
                )
            }

            <div className='h-[4%] flex w-full absolute bottom-0 border'>
                <div
                    className='w-[6%] bg-indigo-600 h-full hide-scrollbar cursor-pointer flex justify-center items-center rounded-md'
                    onClick={toogleSideBar}
                >
                    <GiDolphin size={30} />
                </div>
                <div className='w-[96%] h-full hide-scrollbar'>
                    <OpenedEditors editors={openedEditors} />
                </div>
            </div>
        </div>

    );
};

export default EditorPage;
