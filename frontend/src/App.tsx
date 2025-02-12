import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { DeviceGrid } from './components/devices/DeviceGrid';
import { DeviceGuide } from './components/guide/DeviceGuide';
import { TerminalIDE } from './components/terminal/TerminalIDE';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);

  return (
    <Router>
      <MainLayout
        isDarkMode={isDarkMode}
        showTerminal={showTerminal}
        setShowTerminal={setShowTerminal}
      >
        <Routes>
          <Route path="/" element={<DeviceGrid />} />
          <Route path="/guide" element={<DeviceGuide />} />
          <Route path="/terminal" element={<TerminalIDE />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;