import EditorPage from './pages/editorPage';
import { sideBarStore } from './stores/sideBarStore';
import SideBar from './pages/sideBar';


function App() {

  const sideBarIsOpen = sideBarStore((state) => state.isOpen)

  return (
    <>
      <EditorPage></EditorPage> 
      {sideBarIsOpen && <SideBar></SideBar> }
    </>
  );
}

export default App;
