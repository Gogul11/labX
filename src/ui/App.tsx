import EditorPage from './pages/editorPage';
import { sideBarStore } from './stores/sideBarStore';
import SideBar from './pages/sideBar';
// import HostDashboard from './components/HostDashboard/hostDashboard';


function App() {

  const sideBarIsOpen = sideBarStore((state) => state.isOpen)

  return (
    <>
      <EditorPage></EditorPage> 
      {sideBarIsOpen && <SideBar></SideBar> }
      {/* <HostDashboard></HostDashboard> */}
    </>
  );
}

export default App;
