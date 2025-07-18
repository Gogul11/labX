import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import EditorPage from './pages/editorPage';
import { sideBarStore } from './stores/sideBarStore';
import SideBar from './pages/sideBar';
// import HostDashboard from './components/HostDashboard/hostDashboard';

function AppContent() {
  const sideBarIsOpen = sideBarStore((state) => state.isOpen);
  const location = useLocation();

  const isOnHostDashboard = location.pathname === '/hostDashboard';

  return (
    <>
      {sideBarIsOpen && !isOnHostDashboard && <SideBar />}
      <Routes>
        <Route path="/" element={<EditorPage />} />
        <Route path="/hostDashboard" element={<HostDashboard />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}

export default App;
