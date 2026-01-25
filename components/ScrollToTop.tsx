
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Fixed: Explicitly imported React to resolve the missing namespace error for React.FC
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Forzamos el scroll al inicio (0,0) cada vez que la ruta (pathname) cambie
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
