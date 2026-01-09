import Lenis from 'lenis';
import { useEffect } from 'react';

export const SmoothScroll = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Disable smooth scroll on mobile/touch devices - native scrolling is better
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches || 
                          window.matchMedia('(hover: none)').matches ||
                          'ontouchstart' in window ||
                          navigator.maxTouchPoints > 0;

    // Skip Lenis on mobile - causes jitter and fights with native scroll
    if (isTouchDevice) {
      return;
    }

    const lenis = new Lenis({
      lerp: 0.08, // Slightly smoother for desktop
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
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
