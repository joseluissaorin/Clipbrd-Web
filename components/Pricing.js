"use client";

import { motion, useSpring, useTransform, useMotionValue, useMotionTemplate } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import config from "@/config";
import ButtonCheckout from "./ButtonCheckout";

// <Pricing/> displays the pricing plans for your app
// It's your Stripe config in config.js.stripe.plans[] that will be used to display the plans
// <ButtonCheckout /> renders a button that will redirect the user to Stripe checkout called the /api/stripe/create-checkout API endpoint with the correct priceId

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

const PricingCard = ({ plan, index }) => {
  const cardRef = useRef(null);
  const mousePosition = useMousePosition();
  const [isHovered, setIsHovered] = useState(false);
  
  const rotateX = useSpring(0, { damping: 15, stiffness: 200 });
  const rotateY = useSpring(0, { damping: 15, stiffness: 200 });
  const scale = useSpring(1, { damping: 15, stiffness: 200 });
  const brightness = useSpring(1, { damping: 15, stiffness: 200 });

  useEffect(() => {
    if (!cardRef.current || !isHovered) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const maxRotate = 10;

    const rotateXValue = ((mousePosition.y - centerY) / (rect.height / 2)) * maxRotate;
    const rotateYValue = ((mousePosition.x - centerX) / (rect.width / 2)) * maxRotate;

    rotateX.set(-rotateXValue);
    rotateY.set(rotateYValue);
  }, [mousePosition, isHovered]);

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
  }, [isHovered]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      style={{ 
        scale,
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group w-full max-w-lg"
    >
      {/* Neo-brutalist card base */}
      <div className="absolute -inset-1 bg-gradient-to-r from-[#0090FF]/40 via-[#00D1FF]/40 to-[#00E5FF]/40 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
      <div className="relative bg-gradient-to-br from-white via-white/95 to-white/90 backdrop-blur-xl rounded-[2rem] p-8 shadow-[0_8px_32px_-8px_rgba(0,144,255,0.15)] border border-[#00D1FF]/10 h-full flex flex-col">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-[2rem]" />
        
        {/* Price tag with 3D effect */}
        <motion.div
          style={{ translateZ: 30 }}
          className="relative mb-8 flex-shrink-0"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#0090FF]/20 via-[#00D1FF]/15 to-[#00E5FF]/10 rounded-2xl backdrop-blur-sm" />
          <div className="absolute inset-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]" />
          <div className="relative p-4">
            <motion.div
              animate={{ 
                scale: isHovered ? [1, 1.05, 1] : 1
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="space-y-2"
            >
              <motion.h3 
                style={{ filter: useMotionTemplate`brightness(${brightness})` }}
                className="text-2xl font-bold bg-gradient-to-r from-[#0090FF] via-[#00D1FF] to-[#00E5FF] bg-clip-text text-transparent"
              >
                {plan.name}
              </motion.h3>
              {plan.description && (
                <motion.p 
                  style={{ filter: useMotionTemplate`brightness(${brightness})` }}
                  className="text-base-content/80"
                >
                  {plan.description}
                </motion.p>
              )}
              <div className="flex items-baseline gap-2">
                <motion.span 
                  style={{ filter: useMotionTemplate`brightness(${brightness})` }}
                  className="text-5xl font-bold bg-gradient-to-r from-[#0090FF] via-[#00D1FF] to-[#00E5FF] bg-clip-text text-transparent"
                >
                  €{plan.price}
                </motion.span>
                <motion.span 
                  style={{ filter: useMotionTemplate`brightness(${brightness})` }}
                  className="text-[#0090FF]/80"
                >
                  per month
                </motion.span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* CTA Button with glass effect */}
        <motion.div
          style={{ translateZ: 40 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative mb-8"
        >
          <ButtonCheckout
            priceId={plan.priceId}
            mode="subscription"
            className="relative w-full py-3 px-6 bg-gradient-to-r from-[#0090FF]/90 via-[#00D1FF]/90 to-[#00E5FF]/90 rounded-xl backdrop-blur-sm text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:brightness-110"
          >
            Get Started
          </ButtonCheckout>
        </motion.div>

        {/* Features list with glass effect */}
        <motion.div
          style={{ translateZ: 20 }}
          className="relative flex-grow"
        >
          <motion.h4 
            style={{ filter: useMotionTemplate`brightness(${brightness})` }}
            className="font-medium mb-4 text-base-content/90"
          >
            Features
          </motion.h4>
          <ul className="space-y-4">
            {plan.features.map((feature, i) => (
              <motion.li
                key={feature.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="relative w-5 h-5 flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0090FF]/20 via-[#00D1FF]/20 to-transparent rounded-full backdrop-blur-sm" />
                  <motion.svg
                    style={{ filter: useMotionTemplate`brightness(${brightness})` }}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5 text-[#00D1FF] relative"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                      clipRule="evenodd"
                    />
                  </motion.svg>
                </div>
                <motion.span 
                  style={{ filter: useMotionTemplate`brightness(${brightness})` }}
                  className="text-base-content/80"
                >
                  {feature.name}
                </motion.span>
              </motion.li>
            ))}
          </ul>
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

const Pricing = () => {
  return (
    <section id="pricing" className="relative bg-[#000514] py-32 overflow-hidden">
      <ParticleSystem />
      
      {/* Multiple gradient layers for depth and reduced banding */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0090FF]/15 via-[#00D1FF]/10 via-[#00E5FF]/8 to-[#0090FF]/5" />
        
        {/* Radial gradients for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,144,255,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,209,255,0.1),transparent_50%)]" />
        
        {/* Additional gradient layers with different opacities */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0090FF]/20 via-[#00D1FF]/15 to-transparent backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0090FF]/10 via-transparent to-[#00E5FF]/5" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-[#00D1FF]/[0.02] bg-[size:32px_32px]" />
        
        {/* Subtle glow effects */}
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-[#0090FF]/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-[#00D1FF]/10 blur-[100px] rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="font-bold text-4xl lg:text-5xl tracking-tight bg-gradient-to-r from-[#0090FF] via-[#00D1FF] to-[#00E5FF] bg-clip-text text-transparent [text-shadow:_0_0_30px_rgba(0,209,255,0.5),_0_0_60px_rgba(0,209,255,0.3),_0_0_80px_rgba(0,209,255,0.2)]">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg max-w-xl mx-auto text-white/90">
            Transform your study experience with intelligent clipboard management - Start today!
          </p>
        </motion.div>

        <div className="relative flex justify-center flex-col lg:flex-row items-center lg:items-stretch gap-8">
          {config.stripe.plans.map((plan, index) => (
            <PricingCard key={plan.name} plan={plan} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
