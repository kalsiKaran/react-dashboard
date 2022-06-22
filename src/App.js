import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import  { useStateContext } from './contexts/ContextProvider'
import Sidebar from './components/Sidebar';
import './styles/App.scss';
import Dashboard from './components/Dashboard';
import Table from './components/DataTable/Table';
import Charts from './components/Charts/Charts';

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
        <div className='flex routes-container'>
        <Sidebar />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={(<Dashboard />)} />
          <Route path="/chart" element={(<Charts />)} />
          <Route path="/data-table" element={(<Table />)} />
        </Routes>
        </div>
      </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
