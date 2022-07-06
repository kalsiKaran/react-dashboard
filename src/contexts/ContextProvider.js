import React, { createContext, useContext, useState } from 'react';

const StateContext = createContext();

const initialState = {
  chat: false,
  cart: false,
  userProfile: false,
  notification: false,
};

export const ContextProvider = ({ children }) => {
  const [screenSize, setScreenSize] = useState(undefined);
  const [showDialog, setShowDialog] = useState(false);
  const [dataStatus, setDataStatus] = useState('add');
  const [rowData, setRowData] = useState()
  const [loading, setLoading] = useState(true)
  const [currentColor, setCurrentColor] = useState('#03C9D7');
  const [currentMode, setCurrentMode] = useState('Dark');
  const [themeSettings, setThemeSettings] = useState(false);
  const [activeMenu, setActiveMenu] = useState(false);
  const [isClicked, setIsClicked] = useState(initialState);

  const setMode = (e) => {
    setCurrentMode(e);
    localStorage.setItem('themeMode', e);
  };

  const setColor = (color) => {
    setCurrentColor(color);
    localStorage.setItem('colorMode', color);
  };

  const handleClick = (clicked) => setIsClicked({ ...initialState, [clicked]: true });

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <StateContext.Provider value={{ currentColor, currentMode, activeMenu, screenSize, setScreenSize, handleClick, isClicked, initialState, setIsClicked, setActiveMenu, setCurrentColor, setCurrentMode, setMode, setColor, themeSettings, setThemeSettings, showDialog, setShowDialog, dataStatus, setDataStatus, rowData, setRowData, loading, setLoading }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
