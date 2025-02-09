"use client";

import { motion, useSpring, useTransform, useScroll, useMotionValue, useMotionTemplate, useAnimationControls } from "framer-motion";
import { useState, useEffect, useRef } from "react";

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
  // Reduce number of particles on mobile
  const particles = Array.from({ length: isMobile ? 10 : 30 });
  
  if (isMobile) return null; // Don't render particles on mobile
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          initial={{ 
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
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

const FeatureCard = ({ icon, title, description, index }) => {
  const cardRef = useRef(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isHovered, setIsHovered] = useState(false);
  const mousePosition = useMousePosition();
  
  // Always initialize springs regardless of mobile state
  const rotateX = useSpring(0, { damping: 15, stiffness: 200 });
  const rotateY = useSpring(0, { damping: 15, stiffness: 200 });
  const scale = useSpring(1, { damping: 15, stiffness: 200 });
  const brightness = useSpring(1, { damping: 15, stiffness: 200 });
  
  // Always create the motion template, even if we don't use it on mobile
  const brightnessTemplate = useMotionTemplate`brightness(${brightness})`;

  useEffect(() => {
    if (!cardRef.current || !isHovered || isMobile) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const maxRotate = 10;

    const rotateXValue = ((mousePosition.y - centerY) / (rect.height / 2)) * maxRotate;
    const rotateYValue = ((mousePosition.x - centerX) / (rect.width / 2)) * maxRotate;

    rotateX.set(-rotateXValue);
    rotateY.set(rotateYValue);
  }, [mousePosition, isHovered, isMobile, rotateX, rotateY]);

  useEffect(() => {
    if (isMobile) {
      // Reset all animations on mobile
      scale.set(1);
      brightness.set(1);
      rotateX.set(0);
      rotateY.set(0);
      return;
    }
    
    if (isHovered) {
      scale.set(1.02);
      brightness.set(1.02);
    } else {
      scale.set(1);
      brightness.set(1);
      rotateX.set(0);
      rotateY.set(0);
    }
  }, [isHovered, isMobile, scale, brightness, rotateX, rotateY]);

  // Create the style object based on mobile state
  const cardStyle = isMobile ? {} : {
    scale,
    rotateX,
    rotateY,
    filter: brightnessTemplate,
    transformStyle: "preserve-3d",
    perspective: 1000
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: isMobile ? 0.3 : 0.5, delay: isMobile ? 0 : index * 0.1 }}
      style={cardStyle}
      onHoverStart={() => !isMobile && setIsHovered(true)}
      onHoverEnd={() => !isMobile && setIsHovered(false)}
      className="relative group"
    >
      {/* Neo-brutalist card base */}
      <div className={`absolute -inset-1 bg-gradient-to-r from-primary/40 via-[#00D1FF]/40 to-[#00E5FF]/40 ${isMobile ? 'opacity-30' : `opacity-0 ${!isMobile && 'group-hover:opacity-100'}`} blur-xl transition-opacity duration-500`} />
      <div className="relative bg-white dark:bg-base-100 rounded-[2rem] p-8 shadow-[0_8px_32px_-8px_rgba(0,144,255,0.1)] border border-[#00D1FF]/10 h-[320px] flex flex-col">
        <div className="absolute inset-0 bg-gradient-to-br from-white/90 dark:from-base-100/90 to-transparent rounded-[2rem]" />
        
        {/* Icon container with simplified mobile styling */}
        <motion.div
          style={!isMobile ? { translateZ: 20 } : {}}
          className="relative w-16 h-16 mb-6 flex-shrink-0"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#00D1FF]/20 to-transparent rounded-2xl backdrop-blur-sm" />
          <div className="absolute inset-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]" />
          <div className="relative w-full h-full flex items-center justify-center text-[#00D1FF]">
            <motion.div
              animate={!isMobile && isHovered ? { rotate: [0, 5, -5, 0] } : {}}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {icon}
            </motion.div>
          </div>
          
          {/* Decorative floating shapes - disabled on mobile */}
          {!isMobile && (
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
              className="absolute -z-10 w-4 h-4 rounded-full bg-[#00D1FF]/10 blur-sm -right-2 top-0"
            />
          )}
        </motion.div>

        {/* Content with simplified mobile styling */}
        <motion.div style={!isMobile ? { translateZ: 30 } : {}} className="space-y-3 flex-grow">
          <h3 className={`text-xl font-bold ${isMobile ? 'text-[#00D1FF]' : 'bg-gradient-to-r from-primary/90 via-[#00D1FF]/95 to-[#00E5FF] bg-clip-text text-transparent'}`}>
            {title}
          </h3>
          <p className="text-base-content dark:text-base-content leading-relaxed">
            {description}
          </p>
        </motion.div>

        {/* Interactive background pattern - disabled on mobile */}
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

// Problem Agitation: A crucial, yet overlooked, component for a landing page that sells.
// It goes under your Hero section, and above your Features section.
// Your Hero section makes a promise to the customer: "Our product will help you achieve XYZ".
// Your Problem section explains what happens to the customer if its problem isn't solved.
// The copy should NEVER mention your product. Instead, it should dig the emotional outcome of not fixing a problem.
// For instance:
// - Hero: "ShipFast helps developers launch startups fast"
// - Problem Agitation: "Developers spend too much time adding features, get overwhelmed, and quit." (not about ShipFast at all)
// - Features: "ShipFast has user auth, Stripe, emails all set up for you"
const Problem = () => {
  const { scrollYProgress } = useScroll();
  const containerRef = useRef(null);
  
  const features = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
        </svg>
      ),
      title: "Instant Access",
      description: "No more flipping through pages or searching multiple tabs. Get answers instantly from your study materials.",
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
        </svg>
      ),
      title: "Smart Context",
      description: "Clipbrd understands your study context and provides relevant answers based on your notes and materials.",
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
        </svg>
      ),
      title: "Image Support",
      description: "Works with both text and images. Screenshot a question and get instant help.",
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
        </svg>
      ),
      title: "Privacy First",
      description: "Open source and transparent. Your study data stays private and secure.",
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
        </svg>
      ),
      title: "Universal Compatibility",
      description: "Works seamlessly with any application, including copy-protected content and image-based text.",
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
        </svg>
      ),
      title: "AI-Powered Answers",
      description: "Get instant answers and explanations for your questions, powered by advanced AI that understands your study context.",
    },
  ];

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section className="relative bg-base-100/20 py-16 md:py-32 overflow-hidden" id="problem">
      <ParticleSystem />
      
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-base-200/30 via-base-100/20 to-transparent backdrop-blur-sm" />
        <div className="absolute inset-0 bg-grid-[#00D1FF]/[0.02] bg-[size:32px_32px]" />
      </div>
      
      <div ref={containerRef} className="relative max-w-7xl mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.div className="inline-block relative">
            <motion.h2 
              className="text-4xl md:text-5xl font-extrabold mb-8 bg-gradient-to-br from-primary via-[#00D1FF] to-[#00E5FF] bg-clip-text text-transparent leading-relaxed pb-2"
              style={{ y, opacity }}
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ 
                duration: 5,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              Study Smarter, Not Harder
            </motion.h2>
          </motion.div>
          <p className="text-base-content/80 text-xl max-w-3xl mx-auto leading-relaxed">
            Traditional studying is time-consuming and inefficient. You spend hours searching through notes, textbooks, and online resources to find answers. Clipbrd changes that by bringing AI-powered assistance right to your clipboard.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Problem;
