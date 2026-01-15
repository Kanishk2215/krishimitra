import { HashRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Login from './pages/Login';
import Home from './pages/Home';
import Camera from './pages/Camera';
import KnowledgeBase from './pages/KnowledgeBase';
import History from './pages/History';

function App() {
  return (
    <LanguageProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/camera" element={<Camera />} />
          <Route path="/knowledge" element={<KnowledgeBase />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </HashRouter>
    </LanguageProvider>
  );
}

export default App;
