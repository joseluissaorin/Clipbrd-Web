"use client";

import Image from "next/image";
import { motion, useAnimationControls, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import TestimonialsAvatars from "./TestimonialsAvatars";
import config from "@/config";
import logo from "@/app/icon.png";

// Cursor follower component
const CursorGlow = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 150 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX - 150);
      cursorY.set(e.clientY - 150);
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [cursorX, cursorY]);

  return (
    <motion.div
      className="hidden md:block fixed pointer-events-none w-[300px] h-[300px] rounded-full bg-primary/5 blur-3xl"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
      }}
    />
  );
};

const FloatingElement = ({ delay, className, hover = false }) => {
  const controls = useAnimationControls();
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: [0.15, 0.25, 0.15],
        scale: [1, 1.05, 1],
        rotate: [0, 180, 360]
      }}
      transition={{
        duration: 30,
        delay,
        repeat: Infinity,
        ease: "linear"
      }}
      onMouseEnter={hover ? () => controls.start({ scale: 1.2, opacity: 0.3 }) : undefined}
      onMouseLeave={hover ? () => controls.start({ scale: 1, opacity: 0.2 }) : undefined}
      className={`absolute rounded-[100%] mix-blend-screen filter blur-3xl transition-transform duration-300 ${className}`}
    />
  );
};

const TitleSection = () => {
  const [letterHovered, setLetterHovered] = useState(null);
  const letters = "Clipbrd".split("");
  
  return (
    <div className="w-full relative mx-auto mt-16">
      <CursorGlow />
      
      {/* Background decorative elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 backdrop-blur-[100px] backdrop-filter" />
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
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative flex flex-col items-center justify-center"
        >
          <div className="flex items-center justify-center gap-4 md:gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              transition={{ 
                duration: 0.5, 
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
                    duration: 0.3,
                    delay: 0.2 + (i * 0.05),
                    type: "spring",
                    stiffness: 200
                  }}
                  onMouseEnter={() => setLetterHovered(i)}
                  onMouseLeave={() => setLetterHovered(null)}
                  className={`text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight text-primary text-center relative cursor-default
                    ${letterHovered === i ? 'text-primary' : 'text-primary/90'}
                    transition-colors duration-200
                  `}
                  style={{
                    transform: letterHovered === i ? 'translateY(-5px)' : 'none',
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
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative mx-auto mt-12 h-px w-2/3 max-w-3xl bg-[radial-gradient(ellipse_at_center,rgba(var(--primary-rgb),0.2),transparent_70%)] scale-150"
          />
        </motion.div>
      </div>
    </div>
  );
}

const Hero = () => {
  return (
    <section className="w-full mx-auto bg-base-100/20 flex flex-col items-center justify-center gap-16 lg:gap-20 py-8 pb-24 md:pb-16 lg:py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-base-200/30 via-base-100/20 to-transparent backdrop-blur-sm" />
      
      <TitleSection />
      
      <div className="flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-20 w-full max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col gap-10 lg:gap-14 items-center lg:items-start text-center lg:text-left lg:w-1/2">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="font-extrabold text-4xl lg:text-6xl tracking-tight"
          >
            Your AI-Powered{" "}
            <motion.span 
              className="bg-primary/90 text-primary-content px-2 md:px-4 ml-1 md:ml-1.5 leading-relaxed whitespace-nowrap relative overflow-hidden group inline-block"
              whileHover={{ scale: 1.02 }}
            >
              <motion.span
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              />
              Study Companion
            </motion.span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-base-content/80 text-lg lg:text-xl leading-relaxed lg:leading-relaxed"
          >
            Transform your learning experience with intelligent clipboard management. Get instant, context-aware answers using your personal notes and files.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6 w-full lg:w-auto"
          >
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn btn-primary btn-wide lg:btn-lg group relative overflow-hidden shadow-lg hover:shadow-primary/20 transition-all"
              href="#pricing"
            >
              <motion.span
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ 
                  duration: 1,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              />
              Get Started for €3.99/mo
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="btn btn-outline btn-wide lg:btn-lg transition-all hover:shadow-lg"
              href="#features"
            >
              See How It Works
            </motion.a>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          whileHover={{ scale: 1.02 }}
          className="lg:w-1/2 w-full"
        >
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/40 via-secondary/40 to-accent/40 blur-2xl opacity-20 group-hover:opacity-30 transition-all duration-500" />
            <Image
              src="/demo-clipbrd.png"
              alt="Clipbrd in action - AI-powered study assistance"
              className="rounded-2xl shadow-[0_20px_50px_-10px_rgba(29,78,216,0.15)] relative transition-all duration-500 w-full"
              priority={true}
              width={600}
              height={400}
            />
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="absolute left-0 right-0 md:left-auto md:right-auto md:-translate-x-0 md:-left-8 -bottom-16 md:-bottom-8 bg-base-100/80 rounded-2xl shadow-[0_10px_30px_-10px_rgba(29,78,216,0.25)] p-3 md:p-4 lg:p-8 w-[calc(100%-2rem)] md:w-80 backdrop-blur-sm mx-4 md:mx-0"
            >
              <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-full flex items-center justify-center relative group shrink-0">
                  <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-20" />
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6 text-primary-content">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                  </svg>
                </div>
                <div className="text-center md:text-left">
                  <p className="font-semibold">Smart Learning</p>
                  <p className="text-base-content/60 text-xs whitespace-nowrap">Context-aware AI assistance</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
