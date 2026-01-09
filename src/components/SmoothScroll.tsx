import Lenis from 'lenis';
import { useEffect } from 'react';

export const SmoothScroll = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1, // Smoother linear interpolation for 60fps feel
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      syncTouch: false,
      touchMultiplier: 2,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    // Initial scroll position
    if (window.location.hash) {
      setTimeout(() => {
        lenis.scrollTo(window.location.hash, { offset: -80 });
      }, 500);
    }

    (window as any).lenis = lenis;

    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
      delete (window as any).lenis;
    };
  }, []);

  return <>{children}</>;
};
