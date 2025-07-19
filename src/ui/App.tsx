import { HashRouter, Routes, Route } from 'react-router';
import EditorPage from './pages/editorPage';
import HostDashboard from './components/HostDashboard/hostDashboard';

function AppContent() {

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
