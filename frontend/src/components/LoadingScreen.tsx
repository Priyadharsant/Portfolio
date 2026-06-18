import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Cloud, Database, CheckCircle2, Loader2 } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';

interface LoadingScreenProps {
  isReady?: boolean;
}

const particles = [
  { top: '15%', left: '20%', delay: 0, duration: 8 },
  { top: '25%', left: '80%', delay: 2, duration: 6 },
  { top: '60%', left: '10%', delay: 1, duration: 7 },
  { top: '75%', left: '90%', delay: 3, duration: 9 },
  { top: '80%', left: '30%', delay: 0.5, duration: 8 },
  { top: '45%', left: '50%', delay: 2.5, duration: 7 },
];

const phaseLogs = [
  // Phase 0: Client Request
  [
    'resolve_dns("portfolio.priyadharsan.dev")',
    'client_handshake(ssl_proto: TLSv1.3)',
    'initiate_secure_session(key: ECDHE)',
    'negotiating_session_params... success',
    'GET /api/portfolio HTTP/2 - Fetching headers',
  ],
  // Phase 1: Cloud Server
  [
    'gateway_route("/api/v1/portfolio")',
    'cors_validation("origin: client") - Pass',
    'processing_server_payload...',
    'gzip_compression_active(level: 6)',
    'auth_token_verify("guest_session") - Ok',
  ],
  // Phase 2: Database Layer
  [
    'db_pool_acquire("postgres://...") - 3ms',
    'query_execute("SELECT * FROM projects")',
    'query_execute("SELECT * FROM experiences")',
    'cache_hit("projects_list", ttl: 3600)',
    'compiling_response_json(bytes: 4850)',
  ],
  // Phase 3: Success
  [
    'connection_established(status: 200)',
    'hydrating_dom_viewport() - Success',
    'ready_for_paint(refresh_rate: 60fps)',
    'session_init_complete()',
    'transitioning_to_viewport()',
  ]
];

// Mouse hook to track cursor for 3D tilt and hover glow
const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
      if (!hasMoved) setHasMoved(true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [hasMoved]);

  return { ...mousePosition, hasMoved };
};

const LoadingScreen = ({ isReady = false }: LoadingScreenProps) => {
  const [phase, setPhase] = useState(0); // 0: Mobile, 1: Cloud, 2: DB, 3: Success
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  const mouse = useMousePosition();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Check if current theme is dark
  const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');

  // Phase & Progress cycles
  useEffect(() => {
    if (isReady) {
      setPhase(3);
      setProgress(100);
      return;
    }

    const phaseInterval = setInterval(() => {
      setPhase(prev => (prev === 2 ? 0 : prev + 1));
    }, 1800);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev < 30) return prev + 0.8;
        if (prev < 60) return prev + 0.4;
        if (prev < 90) return prev + 0.15;
        if (prev < 99) return prev + 0.05;
        return 99;
      });
    }, 50);

    return () => {
      clearInterval(phaseInterval);
      clearInterval(progressInterval);
    };
  }, [isReady]);

  // Handle tilt computation
  useEffect(() => {
    if (!mouse.hasMoved) return;
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = mouse.x - cx;
    const dy = mouse.y - cy;
    
    // Smooth tilt angles
    const tiltX = (dy / cy) * -6; 
    const tiltY = (dx / cx) * 6;  
    setTilt({ x: tiltX, y: tiltY });
  }, [mouse.x, mouse.y, mouse.hasMoved]);

  // Log cycling
  useEffect(() => {
    setLogIndex(0);
    const interval = setInterval(() => {
      setLogIndex(prev => (prev + 1) % 5);
    }, 350);
    return () => clearInterval(interval);
  }, [phase]);

  const current = useMemo(() => {
    switch (phase) {
      case 0:
        return {
          icon: Smartphone,
          label: 'Client Handshake',
          status: 'Initiating secure session...',
          color: '#2dd4bf',
          bg: 'rgba(45, 212, 191, 0.05)',
        };
      case 1:
        return {
          icon: Cloud,
          label: 'Cloud Gateway',
          status: 'Resolving application routes...',
          color: '#3b82f6',
          bg: 'rgba(59, 130, 246, 0.05)',
        };
      case 2:
        return {
          icon: Database,
          label: 'Data Layer',
          status: 'Hydrating profile records...',
          color: '#a855f7',
          bg: 'rgba(168, 85, 247, 0.05)',
        };
      case 3:
        return {
          icon: CheckCircle2,
          label: 'Connection Established',
          status: 'System ready. Launching application...',
          color: '#10b981',
          bg: 'rgba(16, 185, 129, 0.05)',
        };
      default:
        return {
          icon: Loader2,
          label: 'Initializing',
          status: 'Preparing components...',
          color: '#94a3b8',
          bg: 'rgba(148, 163, 184, 0.05)',
        };
    }
  }, [phase]);

  const Icon = current.icon;

  return (
    <motion.main 
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f8fbff] px-6 py-12 transition-colors duration-500 dark:bg-[#06070b]"
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0, 
        scale: 1.03,
        filter: 'blur(8px)',
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
      }}
    >
      {/* Slow-moving ambient background particles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full"
            style={{ 
              top: particle.top, 
              left: particle.left, 
              backgroundColor: current.color,
              boxShadow: `0 0 10px ${current.color}`
            }}
            animate={{ 
              y: [0, -80, 0], 
              x: [0, i % 2 === 0 ? 30 : -30, 0],
              opacity: [0, 0.6, 0.2, 0.6, 0], 
              scale: [0.6, 1.3, 0.8, 1.3, 0.6] 
            }}
            transition={{ 
              duration: particle.duration + 2, 
              repeat: Infinity, 
              delay: particle.delay, 
              ease: 'easeInOut' 
            }}
          />
        ))}
      </div>

      {/* Dynamic Ambient Glow (Responsive to Mouse on Desktop) */}
      {mouse.hasMoved ? (
        <motion.div
          className="fixed pointer-events-none rounded-full blur-[130px] z-0"
          style={{
            width: 450,
            height: 450,
            background: `radial-gradient(circle, ${current.color} 0%, transparent 70%)`,
          }}
          animate={{
            x: mouse.x - 225,
            y: mouse.y - 225,
            opacity: isDark ? 0.12 : 0.2,
            scale: [1, 1.05, 1],
          }}
          transition={{
            x: { type: 'spring', damping: 40, stiffness: 150, mass: 0.8 },
            y: { type: 'spring', damping: 40, stiffness: 150, mass: 0.8 },
            scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
            opacity: { duration: 0.3 }
          }}
        />
      ) : (
        <motion.div
          className="absolute h-[450px] w-[450px] rounded-full blur-[130px] pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${current.color} 0%, transparent 70%)`,
          }}
          animate={{
            x: [ -100, 100, 50, -100 ],
            y: [ -50, 50, 100, -50 ],
            opacity: isDark ? [0.08, 0.15, 0.08] : [0.15, 0.25, 0.15],
            scale: [1, 1.1, 1],
          }}
          transition={{
            x: { duration: 10, repeat: Infinity, ease: 'easeInOut' },
            y: { duration: 10, repeat: Infinity, ease: 'easeInOut' },
            opacity: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
            scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
          }}
        />
      )}

      {/* Glassmorphic Centered Card with 3D Tilt */}
      <motion.div
        className="relative z-10 w-full max-w-md backdrop-blur-xl bg-white/40 dark:bg-[#0b0f19]/45 border border-white/30 dark:border-slate-800/40 rounded-3xl p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.08)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.45)]"
        style={{
          transformStyle: 'preserve-3d',
          perspective: 1000,
        }}
        animate={{
          y: [0, -6, 0],
          rotateX: mouse.hasMoved ? tilt.x : 0,
          rotateY: mouse.hasMoved ? tilt.y : 0,
        }}
        transition={{
          y: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
          rotateX: { type: 'spring', damping: 25, stiffness: 100 },
          rotateY: { type: 'spring', damping: 25, stiffness: 100 }
        }}
      >
        <div className="flex flex-col items-center gap-8 w-full">
          
          {/* Central Morphing Icon with Concentric Orbit Tracks */}
          <div className="relative h-28 w-28 flex items-center justify-center">
            
            {/* Outer Orbit (Dotted, rotating clockwise) */}
            <motion.div
              className="absolute inset-0 rounded-full border border-dashed border-slate-300/40 dark:border-slate-700/40"
              animate={{ rotate: 360 }}
              transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
            >
              {/* Satellite Dot 1 */}
              <span 
                className="absolute -top-1 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full shadow-[0_0_8px_currentColor]"
                style={{ backgroundColor: current.color, color: current.color }}
              />
            </motion.div>

            {/* Inner Orbit (Solid thin with gap, rotating counter-clockwise) */}
            <motion.div
              className="absolute inset-2.5 rounded-full border border-slate-300/20 dark:border-slate-800/60"
              animate={{ rotate: -360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            >
              {/* Satellite Dot 2 */}
              <span 
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full shadow-[0_0_6px_currentColor]"
                style={{ backgroundColor: current.color, color: current.color }}
              />
            </motion.div>

            {/* Core Icon wrapper */}
            <AnimatePresence mode="wait">
              <motion.div
                key={phase}
                className="flex h-16 w-16 items-center justify-center rounded-3xl z-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
                style={{ 
                  backgroundColor: current.bg,
                  boxShadow: `inset 0 0 12px ${current.color}15, 0 10px 25px -5px ${current.color}20` 
                }}
                initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 1.4, rotate: 20 }}
                transition={{ type: 'spring', damping: 12, stiffness: 130 }}
              >
                <Icon size={30} style={{ color: current.color }} className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.15)]" />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Label and Primary Status */}
          <div className="text-center w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={phase}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center"
              >
                <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
                  {current.label}
                </h2>
                <p className="mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {current.status}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Technical Sub-logs Feed Ticker */}
            <div className="w-full flex justify-center mt-3 h-5 items-center">
              <div className="font-mono text-[9px] tracking-wide text-slate-400/80 dark:text-slate-500/80 bg-slate-100/50 dark:bg-slate-900/40 py-0.5 px-2.5 rounded border border-slate-200/30 dark:border-slate-800/30 flex items-center gap-1.5 shadow-inner">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: current.color }} />
                <AnimatePresence mode="wait">
                  <motion.span
                    key={`${phase}-${logIndex}`}
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -3 }}
                    transition={{ duration: 0.15 }}
                  >
                    {phaseLogs[phase]?.[logIndex] || 'system_idle()'}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Stepper with Custom Flow Connectors */}
          <div className="flex items-center gap-6 py-3 px-6 rounded-2xl border border-slate-200/50 bg-white/40 dark:border-white/5 dark:bg-slate-900/20 backdrop-blur-md shadow-sm select-none">
            {/* Step 0: Mobile */}
            <div className="relative flex flex-col items-center">
              <motion.div 
                className="relative flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300"
                style={{
                  borderColor: phase >= 0 ? current.color : (isDark ? '#334155' : '#cbd5e1'),
                  backgroundColor: phase === 0 ? current.bg : 'transparent',
                  boxShadow: phase === 0 ? `0 0 12px ${current.color}35` : 'none',
                }}
                animate={phase === 0 ? { y: [0, -2, 0], scale: 1.08 } : { y: 0, scale: 1 }}
                transition={{ duration: 2, repeat: phase === 0 ? Infinity : 0, ease: 'easeInOut' }}
              >
                <Smartphone size={14} style={{ color: phase >= 0 ? current.color : (isDark ? '#475569' : '#94a3b8') }} />
              </motion.div>
            </div>

            {/* Connector line 1 */}
            <div className="relative w-8 h-[2px] bg-slate-200 dark:bg-slate-800 overflow-hidden rounded-full">
              {phase >= 1 && (
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-teal-400 to-blue-500"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5 }}
                  style={{ originX: 0 }}
                />
              )}
              {phase === 0 && (
                <motion.div
                  className="absolute h-full w-4 bg-gradient-to-r from-transparent via-teal-400 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                />
              )}
            </div>

            {/* Step 1: Cloud */}
            <div className="relative flex flex-col items-center">
              <motion.div 
                className="relative flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300"
                style={{
                  borderColor: phase >= 1 ? current.color : (isDark ? '#334155' : '#cbd5e1'),
                  backgroundColor: phase === 1 ? current.bg : 'transparent',
                  boxShadow: phase === 1 ? `0 0 12px ${current.color}35` : 'none',
                }}
                animate={phase === 1 ? { y: [0, -2, 0], scale: 1.08 } : { y: 0, scale: 1 }}
                transition={{ duration: 2, repeat: phase === 1 ? Infinity : 0, ease: 'easeInOut' }}
              >
                <Cloud size={14} style={{ color: phase >= 1 ? current.color : (isDark ? '#475569' : '#94a3b8') }} />
              </motion.div>
            </div>

            {/* Connector line 2 */}
            <div className="relative w-8 h-[2px] bg-slate-200 dark:bg-slate-800 overflow-hidden rounded-full">
              {phase >= 2 && (
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5 }}
                  style={{ originX: 0 }}
                />
              )}
              {phase === 1 && (
                <motion.div
                  className="absolute h-full w-4 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                />
              )}
            </div>

            {/* Step 2: DB */}
            <div className="relative flex flex-col items-center">
              <motion.div 
                className="relative flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300"
                style={{
                  borderColor: phase >= 2 ? current.color : (isDark ? '#334155' : '#cbd5e1'),
                  backgroundColor: phase === 2 ? current.bg : 'transparent',
                  boxShadow: phase === 2 ? `0 0 12px ${current.color}35` : 'none',
                }}
                animate={phase === 2 ? { y: [0, -2, 0], scale: 1.08 } : { y: 0, scale: 1 }}
                transition={{ duration: 2, repeat: phase === 2 ? Infinity : 0, ease: 'easeInOut' }}
              >
                <Database size={14} style={{ color: phase >= 2 ? current.color : (isDark ? '#475569' : '#94a3b8') }} />
              </motion.div>
            </div>
          </div>

          {/* High-Quality Sleek Progress Bar */}
          <div className="w-full space-y-3">
            <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 select-none">
              <span>Syncing Stack</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="relative h-1.5 w-full rounded-full border border-slate-200/50 bg-slate-100 dark:border-white/5 dark:bg-white/5 shadow-inner backdrop-blur-sm overflow-hidden">
              {/* Progress fill */}
              <motion.div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 rounded-full"
                initial={false}
                animate={{ width: `${progress}%` }}
                transition={{ type: 'spring', damping: 25, stiffness: 120 }}
              />
              
              {/* Glowing leading edge bead */}
              <motion.div
                className="absolute top-0 h-full w-3 -ml-1.5 rounded-full bg-white shadow-[0_0_8px_#fff,0_0_15px_rgba(45,212,191,0.8)] z-10"
                initial={false}
                animate={{ left: `${progress}%` }}
                transition={{ type: 'spring', damping: 25, stiffness: 120 }}
              />

              {/* Light Sweep animation */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
              />
            </div>
          </div>
        </div>

        {/* Footer Technical Detail */}
        <motion.div
          className="mt-8 text-center select-none"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <span className="text-[9px] font-black uppercase tracking-[0.35em] text-slate-400 dark:text-slate-600">
            Synchronizing connection streams
          </span>
        </motion.div>
      </motion.div>
    </motion.main>
  );
};

export default LoadingScreen;
