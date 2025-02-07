import Link from "next/link";

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-base-200">
      <div className="max-w-7xl mx-auto px-8 py-16 md:py-32">
        <div className="flex flex-col items-center animate-fade-in">
          <div className="w-full flex justify-center mb-8">
            <Link
              href="/"
              className="btn btn-ghost gap-2 transition-all duration-150 hover:scale-105 hover:bg-base-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform duration-150 group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
          
          <div className="text-center mb-16">
            <h1 className="font-extrabold text-4xl lg:text-6xl tracking-tight mb-8 animate-fade-in-up">
              Download Clipbrd
            </h1>
            <p className="text-lg text-base-content/80 max-w-2xl mx-auto animate-fade-in-up delay-150">
              Get started with Clipbrd today. Currently available for Windows, with macOS and Linux support coming soon.
            </p>
          </div>

          <div className="max-w-lg mx-auto w-full">
            {/* Windows Download */}
            <div className="card bg-base-100 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              <div className="card-body items-center text-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" className="mb-4 transition-transform duration-300 hover:scale-110">
                  <path fill="currentColor" d="M3 5.557L10.5 4.5V11H3V5.557ZM3 12H10.5V18.5L3 17.443V12ZM11.5 4.35L21 3V11H11.5V4.35ZM11.5 12H21V20L11.5 18.65V12Z"/>
                </svg>
                <h2 className="card-title text-2xl mb-2">Windows</h2>
                <p className="text-base-content/70 mb-6">Windows 10/11 (64-bit)</p>
                <Link href="/downloads/clipbrd-win-x64.exe" className="btn btn-primary btn-lg w-full transition-all duration-150 hover:scale-102 hover:shadow-lg">
                  Download for Windows
                </Link>
              </div>
            </div>
          </div>

          <div className="text-center mt-16 animate-fade-in-up delay-300">
            <h2 className="text-2xl font-bold mb-4">System Requirements</h2>
            <div className="max-w-2xl mx-auto text-base-content/80">
              <p className="mb-2"><strong>Windows:</strong> Windows 10 or Windows 11 (64-bit)</p>
              <p className="mt-4">Requires at least 4GB of RAM and 350MB of free disk space.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 