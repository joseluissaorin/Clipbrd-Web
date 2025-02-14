"use client";

import Image from "next/image";
import { motion, useAnimationControls, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import TestimonialsAvatars from "./TestimonialsAvatars";
import config from "@/config";
import logo from "@/app/icon.png";

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

// Cursor follower component - disabled on mobile
const CursorGlow = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 150 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    if (isMobile) return;
    
    const moveCursor = (e) => {
      cursorX.set(e.clientX - 150);
      cursorY.set(e.clientY - 150);
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [cursorX, cursorY, isMobile]);

  if (isMobile) return null;

  return (
    <motion.div
      className="fixed pointer-events-none w-[300px] h-[300px] rounded-full bg-primary/5 blur-3xl"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
      }}
    />
  );
};

const FloatingElement = ({ delay, className, hover = false }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const controls = useAnimationControls();
  
  // Simplified animation for mobile
  const animation = isMobile ? {
    opacity: [0.15, 0.2, 0.15],
    scale: 1,
    rotate: 0
  } : {
    opacity: [0.15, 0.25, 0.15],
    scale: [1, 1.05, 1],
    rotate: [0, 180, 360]
  };

  const transition = isMobile ? {
    duration: 15,
    delay,
    repeat: Infinity,
    ease: "linear"
  } : {
    duration: 30,
    delay,
    repeat: Infinity,
    ease: "linear"
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={animation}
      transition={transition}
      onMouseEnter={!isMobile && hover ? () => controls.start({ scale: 1.2, opacity: 0.3 }) : undefined}
      onMouseLeave={!isMobile && hover ? () => controls.start({ scale: 1, opacity: 0.2 }) : undefined}
      className={`absolute rounded-[100%] mix-blend-screen filter blur-3xl transition-transform duration-300 ${className}`}
    />
  );
};

const TitleSection = () => {
  const [letterHovered, setLetterHovered] = useState(null);
  const letters = "Clipbrd".split("");
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return (
    <div className="w-full relative mx-auto mt-16">
      <CursorGlow />
      
      {/* Background decorative elements - simplified on mobile */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 backdrop-blur-[100px] backdrop-filter" />
        {!isMobile && (
          <>
            <FloatingElement 
              delay={0}
              className="bg-primary/10 w-[150vw] h-[150vh] aspect-square -top-[50vh] -left-[50vw] rounded-[100%]"
              hover
            />
            <FloatingElement 
              delay={5}
              className="bg-secondary/10 w-[150vw] h-[150vh] aspect-square -top-[40vh] -right-[60vw] rounded-[100%]"
              hover
            />
            <FloatingElement 
              delay={2}
              className="bg-accent/10 w-[130vw] h-[130vh] aspect-square -top-[20vh] left-1/4 rounded-[100%]"
              hover
            />
          </>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: isMobile ? 0.3 : 0.5 }}
          className="relative flex flex-col items-center justify-center"
        >
          <div className="flex items-center justify-center gap-4 md:gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              whileHover={!isMobile ? { scale: 1.05 } : undefined}
              transition={{ 
                duration: isMobile ? 0.3 : 0.5,
                delay: 0.1,
                type: "spring",
                stiffness: 200
              }}
              className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 cursor-pointer shrink-0"
            >
              <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(var(--primary-rgb),0.15),transparent_70%)] blur-xl rounded-full scale-150" />
              <Image
                src={logo}
                alt="Clipbrd Logo"
                fill
                className="object-contain drop-shadow-[0_0_25px_rgba(80,200,255,0.4)] transition-transform duration-300"
                priority
              />
            </motion.div>

            <div className="flex items-baseline overflow-visible">
              {letters.map((letter, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: isMobile ? 0.2 : 0.3,
                    delay: isMobile ? 0.1 + (i * 0.03) : 0.2 + (i * 0.05),
                    type: "spring",
                    stiffness: 200
                  }}
                  onMouseEnter={() => !isMobile && setLetterHovered(i)}
                  onMouseLeave={() => !isMobile && setLetterHovered(null)}
                  className={`text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight text-primary text-center relative cursor-default
                    ${letterHovered === i ? 'text-primary' : 'text-primary/90'}
                    transition-colors duration-200
                  `}
                  style={{
                    transform: !isMobile && letterHovered === i ? 'translateY(-5px)' : 'none',
                    transition: 'transform 0.2s ease'
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: isMobile ? 0.5 : 0.8, delay: isMobile ? 0.2 : 0.3 }}
            className="relative mx-auto mt-12 h-px w-2/3 max-w-3xl bg-[radial-gradient(ellipse_at_center,rgba(var(--primary-rgb),0.2),transparent_70%)] scale-150"
          />
        </motion.div>
      </div>
    </div>
  );
}

const ParticleEffect = () => {
  return (
    <div className="absolute inset-0 -z-10">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full backdrop-blur-sm"
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

const FloatingLogo = () => {
  const letters = "Clipbrd".split("");
  const [letterHovered, setLetterHovered] = useState(null);

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-6 md:gap-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 shrink-0"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-2xl scale-150" />
        <motion.div
          animate={{ 
            y: [0, -8, 0],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative w-full h-full hidden md:block"
        >
          <Image
            src={logo}
            alt="Clipbrd Logo"
            fill
            className="object-contain drop-shadow-[0_0_25px_rgba(80,200,255,0.4)]"
            priority
          />
        </motion.div>
        <div className="relative w-full h-full md:hidden">
          <Image
            src={logo}
            alt="Clipbrd Logo"
            fill
            className="object-contain drop-shadow-[0_0_15px_rgba(80,200,255,0.3)]"
            priority
          />
        </div>
      </motion.div>

      <div className="flex items-baseline overflow-visible">
        {letters.map((letter, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.3,
              delay: 0.2 + (i * 0.05),
              type: "spring",
              stiffness: 200
            }}
            onMouseEnter={() => setLetterHovered(i)}
            onMouseLeave={() => setLetterHovered(null)}
            className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-center relative cursor-default
              ${letterHovered === i ? 'text-primary' : 'text-primary/90'}
              transition-all duration-300
              hidden md:inline-block
            `}
            style={{
              transform: letterHovered === i ? 'translateY(-8px) scale(1.1)' : 'none',
              transition: 'transform 0.3s ease',
              textShadow: letterHovered === i ? '0 0 30px rgba(80,200,255,0.4)' : '0 0 20px rgba(80,200,255,0.2)'
            }}
          >
            {letter}
            <span className="absolute inset-0 bg-primary/5 blur-xl -z-10" />
          </motion.span>
        ))}
        {/* Static version for mobile */}
        <div className="md:hidden">
          {letters.map((letter, i) => (
            <span
              key={i}
              className="text-2xl sm:text-3xl font-black tracking-tight text-center text-primary/90"
            >
              {letter}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const SmartLearningTag = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="absolute top-4 right-4 md:top-8 md:right-8"
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-base-100/80 backdrop-blur-md rounded-2xl shadow-[0_8px_20px_-6px_rgba(29,78,216,0.25)] p-3 border border-primary/10"
      >
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-full flex items-center justify-center shrink-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/70 to-primary/60 backdrop-blur-sm" />
            <div className="absolute inset-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]" />
            <div className="absolute inset-0 animate-ping opacity-20 bg-primary/50" />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-primary-content relative z-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-sm">Smart Learning</p>
            <p className="text-base-content/60 text-xs">Context-aware AI</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const RippleEffect = () => {
  const [ripples, setRipples] = useState([]);

  const createRipple = (event, color = "white") => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    
    // Get click position relative to button
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Calculate diagonal length for ripple size
    const size = Math.max(rect.width, rect.height) * 2;
    
    const ripple = {
      x,
      y,
      size,
      color,
      id: Date.now()
    };
    
    setRipples((prevRipples) => [...prevRipples, ripple]);
    
    // Cleanup ripple after animation
    setTimeout(() => {
      setRipples((prevRipples) => prevRipples.filter((r) => r.id !== ripple.id));
    }, 1000);
  };

  return {
    ripples,
    createRipple
  };
};

const Hero = () => {
  const { ripples, createRipple } = RippleEffect();
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-base-100/20 py-4 pb-8 sm:py-8 md:py-20">
      {/* Only show particle effect on desktop */}
      {!isMobile && <ParticleEffect />}
      
      {/* Simplified background gradient for mobile */}
      <div className="absolute inset-0 bg-gradient-to-b from-base-200/30 via-base-100/20 to-transparent backdrop-blur-[2px] md:backdrop-blur-sm" />
      
      <div className="relative mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
        {/* Title Section - Simplified for mobile */}
        <div className="text-center mb-6 sm:mb-12 md:mb-24">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[2.75rem] sm:text-5xl md:text-7xl lg:text-8xl xl:text-8xl font-black tracking-tight mb-4 sm:mb-8 md:mb-16"
          >
            {isMobile ? (
              <div className="leading-[1.1]">
                Your AI-Powered
                <br />
                <span className="bg-gradient-to-r from-primary/90 via-[#00D1FF]/95 to-[#00E5FF] bg-clip-text text-transparent">
                  Study Companion
                </span>
              </div>
            ) : (
              <>
                Your AI-Powered
                <br />
                <motion.span className="inline-block relative">
                  <motion.span
                    className="relative bg-gradient-to-r from-primary/90 via-[#00D1FF]/95 to-[#00E5FF] bg-clip-text text-transparent"
                    animate={{ 
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{ 
                      duration: 5,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    style={{
                      textShadow: "0 0 30px rgba(var(--primary-rgb), 0.6), 0 0 60px rgba(var(--primary-rgb), 0.4)"
                    }}
                  >
                    Study Companion
                  </motion.span>
                </motion.span>
              </>
            )}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <FloatingLogo />
          </motion.div>
        </div>
        
        {/* Content Section - Reordered for mobile */}
        <div className={`relative ${isMobile ? 'flex flex-col gap-8' : 'grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8'} items-start`}>
          {/* Video Section - Shown first on mobile */}
          {isMobile && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative w-full"
            >
              <div className="relative">
                {/* Simplified glass effect for mobile */}
                <div className="absolute -inset-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl blur-xl opacity-20" />
                <div className="relative rounded-2xl overflow-hidden shadow-lg">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover rounded-2xl"
                    poster="/demo-clipbrd.png"
                  >
                    <source src="/demo/demo-video.webm" type="video/webm" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </motion.div>
          )}

          {/* Content Section */}
          <div className={`flex flex-col ${isMobile ? 'items-center text-center space-y-6' : 'items-center lg:items-start text-center lg:text-left space-y-10 lg:sticky lg:top-8'}`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative p-6 sm:p-8 rounded-2xl overflow-hidden"
            >
              {/* Simplified glass card for mobile */}
              {isMobile ? (
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 backdrop-blur-sm rounded-2xl" />
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 backdrop-blur-md rounded-2xl" />
                  <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-primary/10 via-transparent to-secondary/10" />
                  <div className="absolute inset-0 rounded-2xl backdrop-blur-sm bg-white/5" />
                  <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]" />
                  <div className="absolute inset-0 shadow-[0_10px_40px_-15px_rgba(var(--primary-rgb),0.2)] rounded-2xl" />
                </>
              )}

              {/* Content */}
              <div className="relative space-y-6 sm:space-y-8">
                <p className="text-lg sm:text-xl lg:text-2xl text-base-content/90 leading-relaxed max-w-xl">
                  Transform your learning experience with{" "}
                  <span className="text-primary font-semibold">intelligent clipboard management</span>.
                  {isMobile ? (
                    <> Get instant, context-aware answers using your <span className="font-semibold">personal notes and files</span>.</>
                  ) : (
                    <>
                      {" "}Get instant, context-aware answers using your{" "}
                      <span className="relative inline-block">
                        <span className="relative z-10 text-primary-content font-semibold bg-gradient-to-r from-primary/90 via-[#00D1FF]/95 to-[#00E5FF] px-1 rounded">personal notes and files</span>
                        <span className="absolute inset-0 bg-gradient-to-r from-primary via-[#00D1FF] to-[#00E5FF] blur-sm opacity-60" />
                      </span>
                    </>
                  )}
                </p>

                {/* Simplified buttons for mobile */}
                <div className={`flex ${isMobile ? 'flex-col gap-4' : 'flex-col sm:flex-row gap-6'} pt-4`}>
                  <motion.a
                    whileHover={!isMobile && { scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative overflow-hidden rounded-xl"
                    href="#pricing"
                    onClick={(e) => createRipple(e, "rgba(255, 255, 255, 0.3)")}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-[#00D1FF]/95 to-[#00E5FF] backdrop-blur-sm rounded-xl" />
                    <div className="relative px-8 py-3 text-primary-content font-semibold">
                      Get Started for €3.99/mo
                    </div>
                  </motion.a>

                  <motion.a
                    whileHover={!isMobile && { scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative overflow-hidden rounded-xl"
                    href="#features"
                    onClick={(e) => createRipple(e, "rgba(0, 209, 255, 0.2)")}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-[#00D1FF]/20 to-[#00E5FF]/20 backdrop-blur-sm rounded-xl" />
                    <div className="relative px-8 py-3 text-primary font-semibold">
                      See How It Works
                    </div>
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Video Section - Desktop */}
          {!isMobile && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 blur-2xl opacity-20 group-hover:opacity-30 transition-all duration-500" />
                <div className="absolute -inset-px rounded-3xl bg-gradient-to-r from-primary/10 via-transparent to-secondary/10" />
                <div className="absolute -inset-[1px] rounded-3xl backdrop-blur-sm bg-white/5" />
                <div className="absolute inset-0 rounded-3xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]" />
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative rounded-3xl overflow-hidden shadow-[0_10px_40px_-15px_rgba(var(--primary-rgb),0.3)]"
                >
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover rounded-3xl"
                    poster="/demo-clipbrd.png"
                  >
                    <source src="/demo/demo-video.webm" type="video/webm" />
                    Your browser does not support the video tag.
                  </video>
                  <SmartLearningTag />
                </motion.div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Mobile section divider */}
      {isMobile && (
        <div className="absolute bottom-0 left-0 right-0">
          <div className="h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent shadow-[0_0_8px_rgba(var(--primary-rgb),0.3)]" />
          <div className="h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent mt-[1px] blur-[0.5px]" />
        </div>
      )}
    </section>
  );
};

export default Hero;
