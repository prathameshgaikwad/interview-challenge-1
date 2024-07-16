import React, { createContext, useContext, useEffect, useState } from 'react';

const WindowWidthContext = createContext();
const SMALL_DEVICE_BREAKPOINT = 500; // small device breakpoint width constant

export const useWindowWidthContext = () => useContext(WindowWidthContext);

export const WindowWidthProvider = ({ children }) => {
  const [isSmallerDevice, setIsSmallerDevice] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsSmallerDevice(width < SMALL_DEVICE_BREAKPOINT);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <WindowWidthContext.Provider value={{ isSmallerDevice }}>
      {children}
    </WindowWidthContext.Provider>
  );
};
