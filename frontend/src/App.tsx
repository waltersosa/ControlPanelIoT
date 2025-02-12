import React, { useState } from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { DeviceGrid } from './components/devices/DeviceGrid';
import { DeviceGuide } from './components/guide/DeviceGuide';
import { TerminalIDE } from './components/terminal/TerminalIDE';

function Root() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);

  return (
    <MainLayout
      isDarkMode={isDarkMode}
      showTerminal={showTerminal}
      setShowTerminal={setShowTerminal}
    >
      <Outlet />
    </MainLayout>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <DeviceGrid />
      },
      {
        path: "/guide",
        element: <DeviceGuide />
      },
      {
        path: "/terminal",
        element: <TerminalIDE />
      }
    ]
  }
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
});

function App() {
  return <RouterProvider router={router} />;
}

export default App;