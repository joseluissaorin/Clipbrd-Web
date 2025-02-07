import ButtonSignin from "./ButtonSignin";

const CTA = () => {
  return (
    <section className="bg-gradient-to-t from-base-200 to-base-100">
      <div className="max-w-7xl mx-auto px-8 py-16 md:py-32">
        <div className="flex flex-col gap-12 items-center text-center">
          <div className="space-y-6">
            <h2 className="font-extrabold text-4xl lg:text-6xl tracking-tight">
              Transform Your Learning Experience
            </h2>
            <p className="text-base-content/80 text-lg lg:text-xl max-w-2xl mx-auto">
              Join thousands of students who are studying smarter with Clipbrd. Get instant, AI-powered assistance for just €3.99/month.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <ButtonSignin text="Get Started Now" extraStyle="btn-primary btn-wide lg:btn-lg" />
            <a
              href="#features"
              className="btn btn-outline btn-wide lg:btn-lg"
            >
              Learn More
            </a>
          </div>

          <div className="flex items-center gap-8 text-base-content/60">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
              </svg>
              <span>Open Source</span>
            </div>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
              </svg>
              <span>Cancel Anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
              <span>Secure & Private</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
