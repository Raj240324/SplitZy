import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Component that automatically resets the scroll position to the top
 * whenever the route changes.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Standard window scroll reset
    window.scrollTo(0, 0);

    // Lenis scroll reset if it's available on the window object
    const lenis = (window as any).lenis;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
