import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Instantaneous 1:1 tracking for the primary cursor to guarantee hardware-level smoothness
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // A subtle trailing ghost spring to enhance the feeling of speed
  const ghostX = useSpring(-100, { stiffness: 600, damping: 40, mass: 0.4 });
  const ghostY = useSpring(-100, { stiffness: 600, damping: 40, mass: 0.4 });

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
      setIsTouchDevice(true);
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      // 32px cursor size, offset 16 to center
      cursorX.set(e.clientX - 16); 
      cursorY.set(e.clientY - 16);
      ghostX.set(e.clientX - 16);
      ghostY.set(e.clientY - 16);
      if (!isVisible) setIsVisible(true);
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);
    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest('a, button, input, textarea, select, [role="button"], .cursor-pointer');
      setIsHovering(!!isInteractive);
    };

    // Attach to document.documentElement to perfectly detect leaving the web page bounds
    document.documentElement.addEventListener('mousemove', onMouseMove);
    document.documentElement.addEventListener('mouseleave', onMouseLeave);
    document.documentElement.addEventListener('mouseenter', onMouseEnter);
    document.documentElement.addEventListener('mousedown', onMouseDown);
    document.documentElement.addEventListener('mouseup', onMouseUp);
    document.documentElement.addEventListener('mouseover', onMouseOver);

    return () => {
      document.documentElement.removeEventListener('mousemove', onMouseMove);
      document.documentElement.removeEventListener('mouseleave', onMouseLeave);
      document.documentElement.removeEventListener('mouseenter', onMouseEnter);
      document.documentElement.removeEventListener('mousedown', onMouseDown);
      document.documentElement.removeEventListener('mouseup', onMouseUp);
      document.documentElement.removeEventListener('mouseover', onMouseOver);
    };
  }, [isVisible, cursorX, cursorY, ghostX, ghostY]);

  if (isTouchDevice) return null;

  return (
    <>
      {/* Premium Enhancement: Ghost Trail */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] flex items-center justify-center opacity-30"
        style={{ width: 32, height: 32, x: ghostX, y: ghostY }}
        animate={{
          opacity: isVisible && !isHovering ? 0.2 : 0, 
          scale: isClicking ? 0.4 : isHovering ? 0 : 0.8, 
        }}
        transition={{ duration: 0.2 }}
      >
        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none">
          <rect 
            x="8.5" y="8.5" width="7" height="7" 
            fill="#2dd4bf"
            transform="rotate(45 12 12)"
          />
        </svg>
      </motion.div>

      {/* Main Unified Cursor Container */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center"
        style={{ width: 32, height: 32, x: cursorX, y: cursorY }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isClicking ? 0.7 : 1,
        }}
        transition={{ scale: { type: 'spring', stiffness: 500, damping: 20 }, opacity: { duration: 0.2 } }}
      >
        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none">
          <defs>
            <linearGradient id="cursorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2dd4bf" /> {/* teal-400 */}
              <stop offset="100%" stopColor="#0ea5e9" /> {/* sky-500 */}
            </linearGradient>
            <linearGradient id="auraGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.1" />
            </linearGradient>
            
            {/* Native SVG Blur Filters */}
            <filter id="svgBlur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
            </filter>
            <filter id="heavyBlur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
            </filter>
          </defs>
          
          {/* IDLE STATE: Unified Geometric Diamond and Dots */}
          <motion.g
            initial={{ scale: 1, opacity: 1 }}
            animate={{ 
              scale: isHovering ? 2.5 : 1, 
              opacity: isHovering ? 0 : 1,
            }}
            transition={{ type: 'spring', stiffness: 600, damping: 25 }}
            style={{ originX: '12px', originY: '12px' }}
          >
            {/* Ambient Underglow (Enhancement) */}
            <motion.rect 
              x="8.5" y="8.5" width="7" height="7" 
              fill="url(#cursorGradient)"
              filter="url(#heavyBlur)"
              transform="rotate(45 12 12)"
              className="opacity-30 dark:opacity-50"
              style={{ originX: '12px', originY: '12px' }}
            />

            {/* Subtle Breathing Aura around the square */}
            <motion.rect 
              x="7" y="7" width="10" height="10" 
              fill="url(#auraGradient)"
              stroke="url(#cursorGradient)"
              strokeWidth="0.5"
              transform="rotate(45 12 12)"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              style={{ originX: '12px', originY: '12px' }}
            />

            {/* Core Solid Square tilted 45 degrees */}
            <rect 
              x="8.5" y="8.5" width="7" height="7" 
              fill="url(#cursorGradient)"
              transform="rotate(45 12 12)"
            />

            {/* 4 Dots strictly grouped to move together with the core diamond */}
            <g fill="url(#cursorGradient)">
              <circle cx="18.5" cy="5.5" r="1.5" />
              <circle cx="18.5" cy="18.5" r="1.5" />
              <circle cx="5.5" cy="18.5" r="1.5" />
              <circle cx="5.5" cy="5.5" r="1.5" />
            </g>
          </motion.g>

          {/* HOVER STATE: Enhanced Tilted Arrow */}
          <motion.g
            initial={{ scale: 0, opacity: 0, rotate: 15 }}
            animate={{ 
              scale: isHovering ? 1.25 : 0, 
              opacity: isHovering ? 1 : 0,
              rotate: 15
            }}
            transition={{ type: 'spring', stiffness: 600, damping: 25 }}
            style={{ originX: '12px', originY: '12px' }}
          >
            {/* Deep Pulsing Energy Glow behind arrow using Expanded Native SVG Blur */}
            <motion.path 
              d="M6 6L13 21L15 15L21 13L6 6Z" 
              fill="url(#cursorGradient)" 
              filter="url(#svgBlur)"
              className="opacity-40 dark:opacity-70"
              animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.05, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
            
            {/* Crisp Sharpened Arrow Path */}
            <path 
              d="M6 6L13 21L15 15L21 13L6 6Z" 
              fill="url(#cursorGradient)" 
              stroke="rgba(255,255,255,0.9)" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
          </motion.g>
        </svg>
      </motion.div>
    </>
  );
};

export default CustomCursor;
