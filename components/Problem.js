const Arrow = ({ extraStyle }) => {
  return (
    <svg
      className={`shrink-0 w-12 fill-neutral-content opacity-70 ${extraStyle}`}
      viewBox="0 0 138 138"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M72.9644 5.31431C98.8774 43.8211 83.3812 88.048 54.9567 120.735C54.4696 121.298 54.5274 122.151 55.0896 122.639C55.6518 123.126 56.5051 123.068 56.9922 122.506C86.2147 88.9044 101.84 43.3918 75.2003 3.80657C74.7866 3.18904 73.9486 3.02602 73.3287 3.44222C72.7113 3.85613 72.5484 4.69426 72.9644 5.31431Z"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M56.5084 121.007C56.9835 118.685 57.6119 115.777 57.6736 115.445C59.3456 106.446 59.5323 97.67 58.4433 88.5628C58.3558 87.8236 57.6824 87.2948 56.9433 87.3824C56.2042 87.4699 55.6756 88.1435 55.7631 88.8828C56.8219 97.7138 56.6432 106.225 55.0203 114.954C54.926 115.463 53.5093 121.999 53.3221 123.342C53.2427 123.893 53.3688 124.229 53.4061 124.305C53.5887 124.719 53.8782 124.911 54.1287 125.015C54.4123 125.13 54.9267 125.205 55.5376 124.926C56.1758 124.631 57.3434 123.699 57.6571 123.487C62.3995 120.309 67.4155 116.348 72.791 113.634C77.9171 111.045 83.3769 109.588 89.255 111.269C89.9704 111.475 90.7181 111.057 90.9235 110.342C91.1288 109.626 90.7117 108.878 89.9963 108.673C83.424 106.794 77.3049 108.33 71.5763 111.223C66.2328 113.922 61.2322 117.814 56.5084 121.007Z"
        />
      </g>
    </svg>
  );
};
const Step = ({ emoji, text }) => {
  return (
    <div className="w-full md:w-48 flex flex-col gap-2 items-center justify-center">
      <span className="text-4xl">{emoji}</span>
      <h3 className="font-bold">{text}</h3>
    </div>
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
  return (
    <section className="max-w-7xl mx-auto bg-base-100 flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-20 px-8 py-8 lg:py-20">
      <div className="flex flex-col gap-10 lg:gap-14 items-center lg:items-start text-center lg:text-left lg:w-1/2">
        <div>
          <h2 className="font-extrabold text-3xl lg:text-4xl tracking-tight mb-4">
            Study Smarter, Not Harder
          </h2>
          <p className="text-base-content/80 text-lg leading-relaxed">
            Traditional studying is time-consuming and inefficient. You spend hours searching through notes, textbooks, and online resources to find answers. Clipbrd changes that by bringing AI-powered assistance right to your clipboard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full place-items-center md:place-items-start">
          <div className="flex flex-col gap-3 items-center md:items-start text-center md:text-left">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shadow-[0_0_12px_rgba(98,216,255,0.2)]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <h3 className="font-bold text-xl">Instant Access</h3>
            <p className="text-base-content/70">
              No more flipping through pages or searching multiple tabs. Get answers instantly from your study materials.
            </p>
          </div>

          <div className="flex flex-col gap-3 items-center md:items-start text-center md:text-left">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shadow-[0_0_12px_rgba(98,216,255,0.2)]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
              </svg>
            </div>
            <h3 className="font-bold text-xl">Smart Context</h3>
            <p className="text-base-content/70">
              Clipbrd understands your study context and provides relevant answers based on your notes and materials.
            </p>
          </div>

          <div className="flex flex-col gap-3 items-center md:items-start text-center md:text-left">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shadow-[0_0_12px_rgba(98,216,255,0.2)]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
              </svg>
            </div>
            <h3 className="font-bold text-xl">Image Support</h3>
            <p className="text-base-content/70">
              Works with both text and images. Screenshot a question and get instant help.
            </p>
          </div>

          <div className="flex flex-col gap-3 items-center md:items-start text-center md:text-left">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shadow-[0_0_12px_rgba(98,216,255,0.2)]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
              </svg>
            </div>
            <h3 className="font-bold text-xl">Privacy First</h3>
            <p className="text-base-content/70">
              Open source and transparent. Your study data stays private and secure.
            </p>
          </div>
        </div>
      </div>

      <div className="lg:w-1/2">
        <div className="relative">
          <div className="bg-gradient-to-r from-primary to-secondary p-1 rounded-3xl shadow-[0_8px_25px_rgba(98,216,255,0.25)]">
            <div className="bg-base-100 p-8 rounded-[1.35rem]">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center shadow-[0_0_8px_rgba(98,216,255,0.15)]">
                    <span className="text-primary">Q</span>
                  </div>
                  <p className="text-base-content/80">What is the difference between DNA and RNA?</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-secondary/10 rounded-xl flex items-center justify-center shadow-[0_0_8px_rgba(98,216,255,0.15)]">
                    <span className="text-secondary">A</span>
                  </div>
                  <div className="space-y-2 flex-1">
                    <p className="text-base-content/80">Based on your notes, here are the key differences:</p>
                    <ul className="list-disc list-inside text-base-content/70 space-y-1">
                      <li>DNA is double-stranded, RNA is single-stranded</li>
                      <li>DNA uses thymine, RNA uses uracil</li>
                      <li>DNA stores genetic information, RNA helps express it</li>
                      <li>DNA is found in nucleus, RNA in nucleus and cytoplasm</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Problem;
