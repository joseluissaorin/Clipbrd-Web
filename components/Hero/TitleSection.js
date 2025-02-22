"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { useMediaQuery } from "./hooks/useMediaQuery";
import config from "@/config";
import logo from "@/app/icon.png";

const isIOS = () => {
  if (typeof window === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

export const TitleSection = () => {
  const [letterHovered, setLetterHovered] = useState(null);
  const letters = config.appName.split("");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isIOSDevice] = useState(isIOS());

  const initialAnimation = isIOSDevice
    ? { opacity: 0 }
    : { opacity: 0, y: -20 };

  const finalAnimation = isIOSDevice
    ? { opacity: 1 }
    : { opacity: 1, y: 0 };

  return (
    <div className="w-full relative mx-auto mt-8 md:mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={initialAnimation}
          animate={finalAnimation}
          transition={{ duration: isIOSDevice ? 0.2 : isMobile ? 0.3 : 0.5 }}
          className="relative flex flex-col items-center justify-center"
        >
          {/* Subtitle as H1 */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-5xl sm:text-5xl md:text-6xl lg:text-7xl text-center text-black max-w-3xl mx-auto font-black mb-8"
          >
            {config.hero.slogan}
          </motion.h1>

          {/* Logo and Title as H2 */}
          <div className="flex items-center justify-center gap-4 md:gap-8">
            <motion.div
              initial={initialAnimation}
              animate={finalAnimation}
              whileHover={!isMobile && !isIOSDevice ? { scale: 1.05 } : undefined}
              transition={{
                duration: isIOSDevice ? 0.2 : isMobile ? 0.3 : 0.5,
                delay: 0.1,
                type: "spring",
                stiffness: 200,
              }}
              className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 cursor-pointer shrink-0"
            >
              <div 
                className="absolute inset-0 -z-10 rounded-full scale-150"
                style={{
                  background: isIOSDevice 
                    ? "rgba(98, 216, 255, 0.15)"
                    : "radial-gradient(ellipse at center, hsla(var(--p),15%,transparent 70%))",
                  filter: isIOSDevice ? "blur(10px)" : "blur(16px)",
                }}
              />
              <Image
                src={logo}
                alt={`${config.appName} Logo`}
                fill
                className="object-contain transition-transform duration-300"
                style={{
                  filter: isIOSDevice 
                    ? "drop-shadow(0 0 10px rgba(98, 216, 255, 0.4))"
                    : "drop-shadow(0 0 25px rgba(98, 216, 255, 0.4))",
                }}
                priority
              />
            </motion.div>

            <div className="flex items-baseline overflow-visible">
              {letters.map((letter, i) => (
                <motion.h2
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: isIOSDevice ? 0.15 : isMobile ? 0.2 : 0.3,
                    delay: isIOSDevice ? 0.05 + i * 0.02 : isMobile ? 0.1 + i * 0.03 : 0.2 + i * 0.05,
                  }}
                  onMouseEnter={() => !isMobile && !isIOSDevice && setLetterHovered(i)}
                  onMouseLeave={() => !isMobile && !isIOSDevice && setLetterHovered(null)}
                  className={`text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-primary text-center relative cursor-default
                    ${letterHovered === i ? "text-primary" : "text-primary/90"}
                    transition-colors duration-200
                  `}
                  style={{
                    filter: isIOSDevice
                      ? letterHovered === i
                        ? "drop-shadow(0 0 15px rgba(98, 216, 255, 0.6))"
                        : "drop-shadow(0 0 10px rgba(98, 216, 255, 0.4))"
                      : letterHovered === i
                      ? "drop-shadow(0 0 35px rgba(98, 216, 255, 0.6))"
                      : "drop-shadow(0 0 25px rgba(98, 216, 255, 0.4))",
                    transform: !isMobile && !isIOSDevice && letterHovered === i ? "translateY(-5px)" : "none",
                    transition: "transform 0.2s ease, filter 0.2s ease",
                  }}
                >
                  {letter}
                </motion.h2>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}; 