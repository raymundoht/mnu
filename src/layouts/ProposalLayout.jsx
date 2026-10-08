import { useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import GlobalStyles from '../components/GlobalStyles';

export default function ProposalLayout() {
  const cursorRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="noise bg-white text-black min-h-screen font-sans antialiased overflow-x-hidden">
      <GlobalStyles />
      <div id="custom-cursor" ref={cursorRef} className="fixed top-0 left-0 z-[9999] pointer-events-none" />
      <Outlet />
    </div>
  );
}
