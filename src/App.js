import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import  { useStateContext } from './contexts/ContextProvider'
import Sidebar from './components/Sidebar';
import './styles/App.scss';
import Dashboard from './components/Dashboard';

function App() {
  const { setCurrentMode, currentMode } = useStateContext();

  useEffect(() => {
    // const currentThemeColor = localStorage.getItem('colorMode');
    const currentThemeMode = localStorage.getItem('themeMode');
    if (currentThemeMode) {
      // setCurrentColor(currentThemeColor);
      setCurrentMode(currentThemeMode);
    }
  }, []);

  useEffect(() => {
    document.body.className = currentMode === 'Dark' ? 'bg-neutral-900' : 'bg-white'
  }, [currentMode])

  return (
    <div className={currentMode === 'Dark' ? 'dark' : ''}>
      <BrowserRouter>
      <div className="App">
        <div className='flex'>
        <Sidebar />
        <Routes>
          {/* dashboard  */}
          <Route path="/" element={(<Dashboard />)} />
          <Route path="/dashboard" element={(<Dashboard />)} />
        </Routes>
        </div>
      </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
