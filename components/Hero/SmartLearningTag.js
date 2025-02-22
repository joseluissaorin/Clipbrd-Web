"use client";

import { motion } from "framer-motion";

export const SmartLearningTag = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 1.3 }}
      className="absolute top-4 right-4 md:top-8 md:right-8"
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-base-100/80 backdrop-blur-md rounded-2xl shadow-[0_8px_20px_-6px_rgba(83,236,159,0.25)] p-2 md:p-3 border border-primary/10"
      >
        <div className="flex items-center gap-2 md:gap-3">
          <div className="relative w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center shrink-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/70 to-primary/60 backdrop-blur-sm" />
            <div className="absolute inset-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]" />
            <div className="absolute inset-0 animate-ping opacity-20 bg-primary/50" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-3 h-3 md:w-4 md:h-4 text-primary-content relative z-10"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
              />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-xs md:text-sm">Smart AI</p>
            <p className="text-base-content/60 text-[10px] md:text-xs">
              Context-aware Answers
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}; 