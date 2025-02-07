"use client";

import { useRef, useState } from "react";

// <FAQ> component is a lsit of <Item> component
// Just import the FAQ & add your FAQ content to the const faqList

const faqList = [
  {
    question: "What do I get exactly?",
    answer: <div className="space-y-2 leading-relaxed">Loreum Ipseum</div>,
  },
  {
    question: "Can I get a refund?",
    answer: (
      <p>
        Yes! You can request a refund within 7 days of your purchase. Reach out
        by email.
      </p>
    ),
  },
  {
    question: "I have another question",
    answer: (
      <div className="space-y-2 leading-relaxed">Cool, contact us by email</div>
    ),
  },
];

const Item = ({ item }) => {
  const accordion = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li>
      <button
        className="relative flex gap-2 items-center w-full py-5 text-base font-semibold text-left border-t md:text-lg border-base-content/10"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        aria-expanded={isOpen}
      >
        <span
          className={`flex-1 text-base-content ${isOpen ? "text-primary" : ""}`}
        >
          {item?.question}
        </span>
        <svg
          className={`flex-shrink-0 w-4 h-4 ml-auto fill-current`}
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            y="7"
            width="16"
            height="2"
            rx="1"
            className={`transform origin-center transition duration-200 ease-out ${
              isOpen && "rotate-180"
            }`}
          />
          <rect
            y="7"
            width="16"
            height="2"
            rx="1"
            className={`transform origin-center rotate-90 transition duration-200 ease-out ${
              isOpen && "rotate-180 hidden"
            }`}
          />
        </svg>
      </button>

      <div
        ref={accordion}
        className={`transition-all duration-300 ease-in-out opacity-80 overflow-hidden`}
        style={
          isOpen
            ? { maxHeight: accordion?.current?.scrollHeight, opacity: 1 }
            : { maxHeight: 0, opacity: 0 }
        }
      >
        <div className="pb-5 leading-relaxed">{item?.answer}</div>
      </div>
    </li>
  );
};

const FAQ = () => {
  return (
    <section className="bg-base-200" id="faq">
      <div className="max-w-7xl mx-auto px-8 py-16 md:py-32">
        <h2 className="font-extrabold text-4xl lg:text-6xl tracking-tight mb-12 md:mb-24 text-center">
          Frequently Asked Questions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          <div className="space-y-8">
            <div>
              <h3 className="font-bold text-xl mb-4">How does Clipbrd work?</h3>
              <p className="text-base-content/80">
                Clipbrd runs silently in the background, monitoring your clipboard. When you copy text or take a screenshot, it uses AI to analyze your query and provide relevant answers from your personal study materials.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-xl mb-4">Is my data secure?</h3>
              <p className="text-base-content/80">
                Yes! Clipbrd is completely open source, so you can verify how your data is handled. We never store your study materials or queries on our servers. Everything is processed locally on your device.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-xl mb-4">What file formats are supported?</h3>
              <p className="text-base-content/80">
                Clipbrd supports text files (.txt, .pdf, .doc), images (.png, .jpg), and can even work with copy-protected text through OCR technology.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-xl mb-4">Can I use it for exams?</h3>
              <p className="text-base-content/80">
                Clipbrd is designed as a study aid to help you learn and understand concepts better. Please check your institution's policies regarding the use of AI tools during exams.
              </p>
            </div>
          </div>
          <div className="space-y-8">
            <div>
              <h3 className="font-bold text-xl mb-4">How accurate are the answers?</h3>
              <p className="text-base-content/80">
                Clipbrd's answers are based on your own study materials, ensuring relevance to your course. The AI helps interpret and explain concepts but always references your source materials.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-xl mb-4">What platforms are supported?</h3>
              <p className="text-base-content/80">
                Currently, Clipbrd is available for Windows. We're actively working on versions for macOS and Linux to be released soon.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-xl mb-4">Can I cancel my subscription?</h3>
              <p className="text-base-content/80">
                Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-xl mb-4">Do you offer student discounts?</h3>
              <p className="text-base-content/80">
                Our €3.99/month pricing is already optimized for students. We keep it affordable to help as many students as possible improve their learning experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
