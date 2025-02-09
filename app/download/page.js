"use client";

import Link from "next/link";
import { motion, useSpring, useMotionTemplate } from "framer-motion";
import { useState, useEffect } from "react";

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (e) => setMatches(e.matches);
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
};

const ParticleSystem = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  if (isMobile) return null;
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          initial={{ 
            x: Math.random() * 100 + "%",
            y: Math.random() * 100 + "%",
            scale: Math.random() * 0.5 + 0.5,
            opacity: Math.random() * 0.3 + 0.1
          }}
          animate={{
            y: [null, "-20%"],
            opacity: [null, 0]
          }}
          transition={{
            duration: Math.random() * 2 + 2,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 2
          }}
          style={{
            background: `linear-gradient(to right, rgba(var(--primary-rgb), ${Math.random() * 0.2}), rgba(var(--secondary-rgb), ${Math.random() * 0.2}))`,
            width: Math.random() * 4 + 2 + "px",
            height: Math.random() * 4 + 2 + "px",
          }}
        />
      ))}
    </div>
  );
};

const DownloadCard = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isHovered, setIsHovered] = useState(false);
  
  const scale = useSpring(1, { damping: 15, stiffness: 200 });
  const brightness = useSpring(1, { damping: 15, stiffness: 200 });
  const brightnessTemplate = useMotionTemplate`brightness(${brightness})`;

  useEffect(() => {
    if (isMobile) {
      scale.set(1);
      brightness.set(1);
      return;
    }
    
    if (isHovered) {
      scale.set(1.02);
      brightness.set(1.02);
    } else {
      scale.set(1);
      brightness.set(1);
    }
  }, [isHovered, isMobile, scale, brightness]);

  const cardStyle = isMobile ? {} : {
    scale,
    filter: brightnessTemplate,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={cardStyle}
      onHoverStart={() => !isMobile && setIsHovered(true)}
      onHoverEnd={() => !isMobile && setIsHovered(false)}
      className="relative group max-w-lg w-full mx-auto"
    >
      <div className={`absolute -inset-1 bg-gradient-to-r from-primary/40 via-[#00D1FF]/40 to-[#00E5FF]/40 ${isMobile ? 'opacity-30' : `opacity-0 ${!isMobile && 'group-hover:opacity-100'}`} blur-xl transition-opacity duration-500`} />
      <div className="relative bg-white dark:bg-base-100 rounded-[2rem] p-8 shadow-[0_8px_32px_-8px_rgba(0,144,255,0.1)] border border-[#00D1FF]/10">
        <div className="absolute inset-0 bg-gradient-to-br from-white/90 dark:from-base-100/90 to-transparent rounded-[2rem]" />
        
        <motion.div
          style={!isMobile ? { translateZ: 20 } : {}}
          className="relative w-16 h-16 mb-6 mx-auto"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#00D1FF]/20 to-transparent rounded-2xl backdrop-blur-sm" />
          <div className="absolute inset-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]" />
          <div className="relative w-full h-full flex items-center justify-center text-[#00D1FF]">
            <motion.div
              animate={!isMobile && isHovered ? { rotate: [0, 5, -5, 0] } : {}}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                <path fill="currentColor" d="M3 5.557L10.5 4.5V11H3V5.557ZM3 12H10.5V18.5L3 17.443V12ZM11.5 4.35L21 3V11H11.5V4.35ZM11.5 12H21V20L11.5 18.65V12Z"/>
              </svg>
            </motion.div>
          </div>
        </motion.div>

        <motion.div style={!isMobile ? { translateZ: 30 } : {}} className="relative text-center space-y-6">
          <h2 className={`text-2xl font-bold ${isMobile ? 'text-[#00D1FF]' : 'bg-gradient-to-r from-primary/90 via-[#00D1FF]/95 to-[#00E5FF] bg-clip-text text-transparent'}`}>
            Windows
          </h2>
          <p className="text-base-content/70">
            Windows 10/11 (64-bit)
          </p>
          <Link 
            href="/downloads/clipbrd-win-x64.exe"
            className="relative inline-flex w-full group/button"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-[#00D1FF] to-[#00E5FF] rounded-xl blur-md opacity-0 group-hover/button:opacity-50 transition duration-500" />
            <button className="relative w-full px-8 py-4 bg-primary hover:bg-[#00D1FF] text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99]">
              Download for Windows
            </button>
          </Link>
        </motion.div>

        {!isMobile && (
          <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,209,255,0.05),transparent_70%)]" />
            <div className="absolute inset-0 bg-grid-[#00D1FF]/[0.02]" />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default function DownloadPage() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return (
    <div className="relative min-h-screen bg-base-200 overflow-hidden">
      <ParticleSystem />
      
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 backdrop-blur-[100px] backdrop-filter" />
        {!isMobile && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.15 }}
              transition={{ duration: 1 }}
              className="absolute -top-[50vh] -left-[50vw] w-[150vw] h-[150vh] rounded-[100%] bg-primary/10"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.15 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="absolute -top-[40vh] -right-[60vw] w-[150vw] h-[150vh] rounded-[100%] bg-secondary/10"
            />
          </>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-8 py-16 md:py-32">
        <div className="flex flex-col items-center animate-fade-in">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full flex justify-center mb-16"
          >
            <Link
              href="/"
              className="relative group/back inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-transparent rounded-xl opacity-0 group-hover/back:opacity-100 transition-opacity duration-300" />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform duration-300 group-hover/back:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center mb-16"
          >
            <h1 className="font-extrabold text-4xl lg:text-6xl tracking-tight mb-8 bg-gradient-to-r from-primary via-[#00D1FF] to-[#00E5FF] bg-clip-text text-transparent">
              Download Clipbrd
            </h1>
            <p className="text-lg text-base-content/80 max-w-2xl mx-auto">
              Get started with Clipbrd today. Currently available for Windows, with macOS and Linux support coming soon.
            </p>
          </motion.div>

          <DownloadCard />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mt-16"
          >
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary/90 via-[#00D1FF]/95 to-[#00E5FF] bg-clip-text text-transparent">
              System Requirements
            </h2>
            <div className="max-w-2xl mx-auto space-y-4 text-base-content/80">
              <p className="font-semibold">
                <span className="text-[#00D1FF]">Windows:</span> Windows 10 or Windows 11 (64-bit)
              </p>
              <p>
                Requires at least 4GB of RAM and 450MB of free disk space.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 