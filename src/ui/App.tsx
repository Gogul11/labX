import { HashRouter, Routes, Route } from 'react-router';
import EditorPage from './pages/editorPage';
import HostDashboard from './components/HostDashboard/hostDashboard';
import { useSocket } from './utils/soc';
import { useEffect } from 'react';
import { sideBarStore } from './stores/sideBarStore';

function AppContent() {

  useSocket(); 

  useEffect(() => {
    window.electronApi.invokeOpenDir(() => {
      if(!sideBarStore.getState().isOpen) 
        sideBarStore.getState().toggle()
      sideBarStore.getState().setAcitveTab('open')
      console.log('hi')
    })
  })

  return (
    <>
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
