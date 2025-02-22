"use client";

import { motion, useSpring, useTransform, useMotionValue, useMotionTemplate } from "framer-motion";
import { useState, useRef } from "react";
import { useMediaQuery } from "./hooks/useMediaQuery";
import { CursorGlow } from "./CursorGlow";
import { FloatingElements } from "./FloatingElements";
import { TitleSection } from "./TitleSection";
import { VideoSection } from "./VideoSection";
import { SmartLearningTag } from "./SmartLearningTag";
import config from "@/config";
import ButtonSignin from "../ButtonSignin";

const Hero = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isIOSDevice] = useState(() => 
    typeof window !== 'undefined' && 
    /iPad|iPhone|iPod/.test(navigator.userAgent) && 
    !(window).MSStream
  );
  const cardRef = useRef(null);
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const scale = useSpring(1, { damping: 15, stiffness: 200 });
  const brightness = useSpring(1, { damping: 15, stiffness: 200 });
  const containerScale = useSpring(1, { damping: 15, stiffness: 200 });

  return (
    <section className="relative w-full overflow-hidden min-h-[600px] lg:min-h-[700px]">
      {/* Interactive elements - disabled on mobile and iOS */}
      {!isMobile && !isIOSDevice && <CursorGlow />}
      <FloatingElements />

      {/* Main content */}
      <div className="max-w-7xl mx-auto h-full">
        <TitleSection />
        
        {/* Enhanced unified glass card container */}
        <motion.div 
          ref={containerRef}
          className="relative px-2 sm:px-4 lg:px-6 mt-4 sm:mt-8"
          style={{ scale: containerScale }}
          whileHover={() => !isMobile && containerScale.set(1.005)}
          onHoverEnd={() => !isMobile && containerScale.set(1)}
        >
          {/* Neo-skeuomorphic glass card background with enhanced depth */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/70 to-white/60 rounded-[2rem] shadow-[0_8px_32px_-8px_rgba(0,144,255,0.15)] border border-[#00D1FF]/10 backdrop-blur-sm">
            {/* Enhanced glass effect layers */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(98,216,255,0.15),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(98,216,255,0.1),transparent_50%)]" />
            <div className="absolute inset-0 rounded-[2.5rem] shadow-inner border border-white/40" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.8)_0%,rgba(255,255,255,0.2)_100%)] rounded-[2.5rem]" />
            <div className="absolute inset-[1px] rounded-[2.5rem] bg-[linear-gradient(120deg,rgba(255,255,255,0.3)_0%,rgba(255,255,255,0)_100%)]" />
            
            {/* Shine effect */}
            <div className="absolute -inset-[1px] bg-[linear-gradient(120deg,rgba(255,255,255,0.4)_0%,rgba(255,255,255,0)_100%)] rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </div>

          {/* Content container with enhanced depth */}
          <div className="relative flex flex-col lg:flex-row lg:items-stretch lg:gap-8 p-4 lg:p-6 h-full">
            {/* Call to action card with enhanced glass effect */}
            <motion.div
              ref={cardRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: isIOSDevice ? 0.2 : 0.5, delay: 1.1 }}
              style={{ 
                scale,
                transformStyle: "preserve-3d",
                perspective: 1000
              }}
              onHoverStart={() => {
                setIsHovered(true);
                scale.set(1.02);
                brightness.set(1.1);
              }}
              onHoverEnd={() => {
                setIsHovered(false);
                scale.set(1);
                brightness.set(1);
              }}
              className="relative w-full lg:w-[35%] h-100 group"
            >
              {/* Enhanced neo-skeuomorphic card */}
              <div className="relative h-full bg-gradient-to-br from-[#0090FF] via-[#00D1FF] to-[#00E5FF] backdrop-blur-xl rounded-2xl overflow-hidden shadow-[0_8px_32px_-4px_rgba(0,144,255,0.3)]">
                {/* Enhanced glass effect layers */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.2),transparent_70%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.15),transparent_50%)]" />
                <div className="absolute inset-[1px] rounded-2xl border border-white/20" />
                <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0)_100%)]" />
                
                {/* Content with enhanced 3D transform */}
                <motion.div
                  style={{ translateZ: 30 }}
                  className="relative flex flex-col justify-between p-8 h-100"
                >
                  <motion.div className="space-y-6 text-center">
                    <motion.p 
                      style={{ filter: useMotionTemplate`brightness(${brightness})` }}
                      className="text-white/95 text-lg lg:text-xl max-w-xl mx-auto font-medium [text-shadow:_0_1px_2px_rgba(0,0,0,0.1)] leading-relaxed"
                    >
                      {config.hero.description}
                    </motion.p>
                  </motion.div>

                  <motion.div 
                    style={{ translateZ: 40 }}
                    className="flex flex-col sm:flex-row lg:flex-col items-center justify-center gap-4 mt-auto pt-10"
                  >
                    {/* Enhanced primary button */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative w-full group/button"
                    >
                      <div className="absolute -inset-[1px] bg-gradient-to-r from-white/80 via-white to-white/80 rounded-xl opacity-0 group-hover/button:opacity-100 blur transition-all duration-300" />
                      <ButtonSignin 
                        text="Get Started for 3,99€" 
                        extraStyle="relative w-full py-3 px-8 bg-gradient-to-br from-white/95 via-white/90 to-white/85 rounded-xl backdrop-blur-sm text-[#00D1FF] font-semibold shadow-[0_8px_16px_-4px_rgba(255,255,255,0.3),inset_0_1px_2px_rgba(255,255,255,0.4)] hover:shadow-[0_12px_20px_-4px_rgba(255,255,255,0.4),inset_0_1px_2px_rgba(255,255,255,0.4)] transition-all duration-300 hover:brightness-110 border border-white/40" 
                      />
                    </motion.div>

                    {/* Enhanced secondary button */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative w-full group/button"
                    >
                      <div className="absolute -inset-[1px] bg-gradient-to-r from-white/20 via-white/30 to-white/20 rounded-xl opacity-0 group-hover/button:opacity-100 blur transition-all duration-300" />
                      <motion.a
                        href="#features"
                        className="relative block w-full py-3 px-8 bg-gradient-to-br from-white/20 via-white/15 to-white/10 rounded-xl backdrop-blur-sm text-white font-semibold shadow-[0_8px_16px_-4px_rgba(255,255,255,0.15),inset_0_1px_2px_rgba(255,255,255,0.2)] hover:shadow-[0_12px_20px_-4px_rgba(255,255,255,0.25),inset_0_1px_2px_rgba(255,255,255,0.2)] transition-all duration-300 hover:brightness-110 text-center border border-white/20"
                      >
                        Learn More
                      </motion.a>
                    </motion.div>
                  </motion.div>
                </motion.div>

                {/* Enhanced decorative elements */}
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
                  className="absolute -z-10 w-32 h-32 rounded-full bg-gradient-to-br from-white/20 to-transparent blur-xl -right-16 top-0"
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
                  className="absolute -z-10 w-40 h-40 rounded-full bg-gradient-to-br from-white/20 to-transparent blur-xl -left-20 bottom-0"
                />
              </div>
            </motion.div>

            {/* Video section with enhanced glass effect */}
            <div className="lg:w-[65%] h-full mt-4 lg:mt-0 relative">
              <div className="absolute inset-[-1px] rounded-2xl bg-gradient-to-br from-white/40 via-white/30 to-white/20 blur-[2px]" />
              <div className="h-full">
                <VideoSection />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero; 