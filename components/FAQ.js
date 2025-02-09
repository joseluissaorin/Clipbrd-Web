"use client";

import { useRef, useState, useEffect } from "react";
import { Search, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// <FAQ> component is a lsit of <Item> component
// Just import the FAQ & add your FAQ content to the const faqList

const faqList = [
  {
    question: "How does Clipbrd work?",
    answer: (
      <p className="text-base-content/80">
        Clipbrd runs silently in the background, monitoring your clipboard. When you copy text or take a screenshot, it uses AI to analyze your query and provide relevant answers from your personal study materials.
      </p>
    ),
    category: "features",
  },
  {
    question: "Is my data secure?",
    answer: (
      <p className="text-base-content/80">
        Yes! Clipbrd is completely open source, so you can verify how your data is handled. We never store your study materials or queries on our servers. Everything is processed locally on your device.
      </p>
    ),
    category: "technical",
  },
  {
    question: "What file formats are supported?",
    answer: (
      <p className="text-base-content/80">
        Clipbrd supports text files (.txt, .pdf, .doc), images (.png, .jpg), and can even work with copy-protected text through OCR technology.
      </p>
    ),
    category: "technical",
  },
  {
    question: "Can I use it for exams?",
    answer: (
      <p className="text-base-content/80">
        Clipbrd is designed as a study aid to help you learn and understand concepts better. Please check your institution's policies regarding the use of AI tools during exams.
      </p>
    ),
    category: "general",
  },
  {
    question: "How accurate are the answers?",
    answer: (
      <p className="text-base-content/80">
        Clipbrd's answers are based on your own study materials, ensuring relevance to your course. The AI helps interpret and explain concepts but always references your source materials.
      </p>
    ),
    category: "features",
  },
  {
    question: "What platforms are supported?",
    answer: (
      <p className="text-base-content/80">
        Currently, Clipbrd is available for Windows. We're actively working on versions for macOS and Linux to be released soon.
      </p>
    ),
    category: "technical",
  },
  {
    question: "Can I cancel my subscription?",
    answer: (
      <p className="text-base-content/80">
        Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period.
      </p>
    ),
    category: "pricing",
  },
  {
    question: "Do you offer student discounts?",
    answer: (
      <p className="text-base-content/80">
        Our €3.99/month pricing is already optimized for students. We keep it affordable to help as many students as possible improve their learning experience.
      </p>
    ),
    category: "pricing",
  },
];

const Item = ({ item, index }) => {
  const accordion = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.li
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="relative group"
    >
      {/* Glass card base */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300" />
      
      <button
        className={`relative flex gap-2 items-center w-full p-6 text-base font-medium text-left transition-all duration-300 rounded-lg ${
          isOpen 
            ? "bg-primary/5 shadow-[inset_0_0_30px_rgba(var(--primary-rgb),0.1)]" 
            : "hover:bg-primary/5"
        }`}
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        aria-expanded={isOpen}
      >
        <span className="text-xs font-mono text-base-content/60 mr-2">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span
          className={`flex-1 text-base-content ${
            isOpen ? "text-primary font-semibold" : ""
          }`}
        >
          {item?.question}
        </span>
        <ChevronDown
          className={`flex-shrink-0 w-5 h-5 text-primary transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-6 pt-2 leading-relaxed text-base-content/80">
              {item?.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
};

const CategoryButton = ({ 
  category, 
  isSelected, 
  onClick,
  count 
}) => (
  <motion.button
    whileHover={{ scale: 1.02, y: -1 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`relative group overflow-hidden px-4 py-2 rounded-full text-sm font-medium transition-all duration-300`}
  >
    {/* Glass button base */}
    <div className={`absolute inset-0 ${
      isSelected
        ? "bg-gradient-to-r from-primary/90 via-[#00D1FF]/95 to-[#00E5FF] backdrop-blur-sm"
        : "bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 backdrop-blur-sm opacity-0 group-hover:opacity-100"
    } rounded-full transition-all duration-300`} />
    <div className="absolute inset-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)] rounded-full" />
    
    <span className={`relative ${
      isSelected ? "text-primary-content" : "text-base-content/80"
    }`}>
      {category.label}
      {count > 0 && (
        <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${
          isSelected ? "bg-white/20" : "bg-primary/10 text-primary"
        }`}>
          {count}
        </span>
      )}
    </span>
  </motion.button>
);

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { value: "all", label: "All Questions" },
    { value: "general", label: "General" },
    { value: "features", label: "Features" },
    { value: "technical", label: "Technical" },
    { value: "pricing", label: "Pricing" },
  ];

  const filteredFAQs = faqList.filter((item) => {
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const questionsInCategory = (category) =>
    category === "all"
      ? faqList.length
      : faqList.filter((item) => item.category === category).length;

  return (
    <section className="bg-gradient-to-b from-base-200 to-base-100" id="faq">
      <div className="max-w-5xl mx-auto px-8 py-16 md:py-32">
        <div className="text-center space-y-4 mb-16">
          <h2 className="font-extrabold text-4xl lg:text-6xl tracking-tight bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-base-content/80 max-w-2xl mx-auto">
            Find answers to common questions about Clipbrd and how it can help you study more effectively.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-8">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg -m-1 blur-xl" />
            <div className="relative bg-base-100/50 rounded-lg shadow-sm border border-primary/10 backdrop-blur-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/60" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300 text-base-content placeholder:text-base-content/60"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-primary/10 transition-colors"
                >
                  <X className="h-4 w-4 text-base-content/60" />
                </button>
              )}
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <CategoryButton
                key={category.value}
                category={category}
                isSelected={selectedCategory === category.value}
                onClick={() => setSelectedCategory(category.value)}
                count={questionsInCategory(category.value)}
              />
            ))}
          </div>

          {/* FAQ List */}
          <motion.div layout className="space-y-4">
            {filteredFAQs.length > 0 ? (
              <ul className="space-y-4">
                {filteredFAQs.map((item, i) => (
                  <Item key={i} item={item} index={i} />
                ))}
              </ul>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-lg"
              >
                {/* Glass card base */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 backdrop-blur-sm" />
                <div className="absolute inset-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]" />
                
                <div className="relative text-center py-12 px-6">
                  <p className="text-lg font-medium text-base-content/80 mb-2">
                    No questions found
                  </p>
                  <p className="text-sm text-base-content/60">
                    Try adjusting your search or filter to find what you're looking for.
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Stats */}
          {!searchQuery && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-8 border-t border-base-content/10">
              {categories.slice(1).map((category) => (
                <motion.div
                  key={category.value}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative overflow-hidden rounded-lg p-4 text-center group"
                >
                  {/* Glass card base */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  <div className="absolute inset-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]" />
                  
                  <div className="relative">
                    <div className="text-2xl font-bold text-primary">
                      {questionsInCategory(category.value)}
                    </div>
                    <div className="text-sm text-base-content/60">
                      {category.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
