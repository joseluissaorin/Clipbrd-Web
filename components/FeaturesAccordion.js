"use client";

import { useState } from "react";

const FeaturesAccordion = () => {
  const [activeAccordion, setActiveAccordion] = useState(1);

  const items = [
    {
      id: 1,
      title: "Smart Clipboard Management",
      description: "Clipbrd intelligently monitors your clipboard and provides instant, context-aware assistance based on your copied content.",
      image: "/demo-smart-clipboard.png",
    },
    {
      id: 2,
      title: "AI-Powered Answers",
      description: "Get instant answers and explanations for your questions, powered by advanced AI that understands your study context.",
      image: "/demo-ai-answers.png",
    },
    {
      id: 3,
      title: "Universal Compatibility",
      description: "Works seamlessly with any application, including copy-protected content and image-based text.",
      image: "/demo-compatibility.png",
    },
  ];

  return (
    <section className="bg-base-100">
      <div className="py-24 px-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-24">
          <div className="w-full lg:w-1/2 lg:sticky lg:top-32 lg:h-fit">
            <div className="relative">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`${
                    activeAccordion === item.id
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-95"
                  } absolute transition-all duration-500 ease-in-out`}
                >
                  <div className="bg-base-300 rounded-3xl aspect-square"></div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-1/2">
            <div className="flex flex-col gap-8">
              {items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActiveAccordion(item.id)}
                  className={`flex flex-col gap-8 px-8 py-6 bg-base-100 rounded-3xl cursor-pointer transition-all duration-300 ${
                    activeAccordion === item.id
                      ? "bg-base-200 shadow-[0_10px_30px_-10px_rgba(29,78,216,0.25)]"
                      : "hover:bg-base-200"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold">{item.title}</h3>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className={`w-6 h-6 transition-transform duration-300 ${
                          activeAccordion === item.id ? "rotate-45" : ""
                        }`}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 6v12m6-6H6"
                        />
                      </svg>
                    </div>
                    <p className="mt-3 text-base-content/80 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesAccordion;
