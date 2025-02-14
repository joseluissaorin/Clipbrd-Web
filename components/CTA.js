"use client";

import { motion, useSpring, useTransform, useMotionValue, useMotionTemplate } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import ButtonSignin from "./ButtonSignin";
import useMediaQuery from "@/hooks/useMediaQuery";

const ParticleSystem = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 30 }).map((_, i) => (
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

const NoiseTexture = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.15] mix-blend-overlay pointer-events-none"
    viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <filter id="noiseFilter">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
    </filter>
    <rect width="100%" height="100%" filter="url(#noiseFilter)"/>
  </svg>
);

const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  return mousePosition;
};

const CTACard = () => {
  const cardRef = useRef(null);
  const mousePosition = useMousePosition();
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const rotateX = useSpring(0, { damping: 15, stiffness: 200 });
  const rotateY = useSpring(0, { damping: 15, stiffness: 200 });
  const scale = useSpring(1, { damping: 15, stiffness: 200 });
  const brightness = useSpring(1, { damping: 15, stiffness: 200 });

  useEffect(() => {
    if (!cardRef.current || !isHovered || isMobile) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const maxRotate = 5;

    const rotateXValue = ((mousePosition.y - centerY) / (rect.height / 2)) * maxRotate;
    const rotateYValue = ((mousePosition.x - centerX) / (rect.width / 2)) * maxRotate;

    rotateX.set(-rotateXValue);
    rotateY.set(rotateYValue);
  }, [mousePosition, isHovered, isMobile, rotateX, rotateY]);

  useEffect(() => {
    if (isHovered) {
      scale.set(1.02);
      brightness.set(1.1);
    } else {
      scale.set(1);
      brightness.set(1);
      rotateX.set(0);
      rotateY.set(0);
    }
  }, [isHovered, scale, brightness, rotateX, rotateY]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      style={{ 
        scale,
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative w-full max-w-4xl mx-auto group"
    >
      {/* Neo-brutalist card base */}
      <div className="absolute -inset-1 bg-gradient-to-r from-[#0090FF]/40 via-[#00D1FF]/40 to-[#00E5FF]/40 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
      <div className="relative bg-gradient-to-br from-white via-white/95 to-white/90 dark:from-base-100 dark:via-base-100/95 dark:to-base-100/90 backdrop-blur-xl rounded-[2rem] p-12 shadow-[0_8px_32px_-8px_rgba(0,144,255,0.15)] border border-[#00D1FF]/10">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 dark:from-base-100/10 to-transparent rounded-[2rem]" />
        
        {/* Content with 3D transform */}
        <motion.div
          style={{ translateZ: 30 }}
          className="relative space-y-8 text-center"
        >
          <motion.h2 
            style={{ filter: useMotionTemplate`brightness(${brightness})` }}
            className="text-4xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-[#0090FF] via-[#00D1FF] to-[#00E5FF] bg-clip-text text-transparent"
          >
            Transform Your Learning Experience
          </motion.h2>
          
          <motion.p 
            style={{ filter: useMotionTemplate`brightness(${brightness})` }}
            className="text-base-content/80 text-lg lg:text-xl max-w-2xl mx-auto"
          >
            Join thousands of students who are studying smarter with Clipbrd. Get instant, AI-powered assistance for just €3.99/month.
          </motion.p>

          <motion.div 
            style={{ translateZ: 40 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <ButtonSignin 
                text="Get Started Now" 
                extraStyle="relative py-3 px-8 bg-gradient-to-r from-[#0090FF]/90 via-[#00D1FF]/90 to-[#00E5FF]/90 rounded-xl backdrop-blur-sm text-white font-medium shadow-[0_8px_16px_-4px_rgba(0,144,255,0.5)] hover:shadow-[0_12px_20px_-4px_rgba(0,144,255,0.6)] transition-all duration-300 hover:brightness-110 min-w-[200px]" 
              />
            </motion.div>

            <motion.a
              href="#features"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative py-3 px-8 bg-gradient-to-r from-[#0090FF]/20 via-[#00D1FF]/20 to-[#00E5FF]/20 rounded-xl backdrop-blur-sm text-[#00D1FF] font-medium shadow-[0_8px_16px_-4px_rgba(0,144,255,0.25)] hover:shadow-[0_12px_20px_-4px_rgba(0,144,255,0.35)] transition-all duration-300 hover:brightness-110 min-w-[200px]"
            >
              Learn More
            </motion.a>
          </motion.div>

          <motion.div 
            style={{ translateZ: 20 }}
            className="flex flex-wrap items-center justify-center gap-8 text-base-content/60"
          >
            {[
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                ),
                text: "Open Source"
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                ),
                text: "Cancel Anytime"
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                ),
                text: "Secure & Private"
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-2"
              >
                <div className="relative w-8 h-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00D1FF]/20 to-transparent rounded-lg backdrop-blur-sm" />
                  <div className="absolute inset-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]" />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="relative w-8 h-8 text-[#00D1FF]"
                  >
                    {item.icon}
                  </svg>
                </div>
                <span>{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Decorative floating shapes */}
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -z-10 w-20 h-20 rounded-full bg-[#00D1FF]/5 blur-xl -right-10 top-10"
        />
        <motion.div
          animate={{ 
            rotate: [360, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -z-10 w-32 h-32 rounded-full bg-[#0090FF]/5 blur-xl -left-16 bottom-20"
        />
      </div>
    </motion.div>
  );
};

const CTA = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return (
    <section className="relative bg-[#000514] py-32 overflow-hidden">
      {!isMobile && <ParticleSystem />}
      
      {/* Multiple gradient layers for depth */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0090FF]/15 via-[#00D1FF]/10 via-[#00E5FF]/8 to-[#0090FF]/5" />
        
        {/* Radial gradients for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,144,255,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,209,255,0.1),transparent_50%)]" />
        
        {/* Additional gradient layers */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0090FF]/20 via-[#00D1FF]/15 to-transparent backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0090FF]/10 via-transparent to-[#00E5FF]/5" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-[#00D1FF]/[0.02] bg-[size:32px_32px]" />
        
        {/* Subtle glow effects */}
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-[#0090FF]/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-[#00D1FF]/10 blur-[100px] rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-8">
        <CTACard />
      </div>
    </section>
  );
};

export default CTA;
