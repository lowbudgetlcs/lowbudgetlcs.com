import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  // Extracts pathname property(key) from an object
  const { pathname } = useLocation();

  // Automatically scrolls to top whenever pathname changes
  useEffect(() => {
    if(pathname.indexOf('allstars') === -1) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);
  return null;
}

export default ScrollToTop;