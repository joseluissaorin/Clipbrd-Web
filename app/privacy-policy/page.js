import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";
import ReactMarkdown from "react-markdown";

export const metadata = getSEOTags({
  title: `Privacy Policy | ${config.appName}`,
  canonicalUrlRelative: "/privacy-policy",
});

const privacyPolicyContent = `**Privacy Policy**  
Effective Date: October 13, 2024

Welcome to Clipbrd! Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information.

**1. Information We Collect**  
We collect the following personal data when you use Clipbrd:
- Name
- Email address
- Payment information

We also collect non-personal data such as web cookies to enhance your experience on our website.

**2. Purpose of Data Collection**  
We use the personal information we collect to process your orders and provide access to our services while your subscription is active.

**3. Data Sharing**  
We do not share your personal information with third parties.

**4. Children's Privacy**  
Clipbrd does not collect any information from children under the age of 13. If we become aware that we have collected personal information from a child, we will delete it immediately.

**5. Ownership and Use of the Service**  
While your subscription is active, you are provided with a key to register the Clipbrd program. You are not permitted to distribute or resell the program.

**6. Updates to this Privacy Policy**  
We may update this Privacy Policy from time to time. When we do, we will notify you by email.

If you have any questions or concerns, please contact us at jl@clipbrdapp.com.

Thank you for choosing Clipbrd!`;

const PrivacyPolicy = () => {
  return (
    <main className="max-w-xl mx-auto">
      <div className="p-5">
        <Link href="/" className="btn btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M15 10a.75.75 0 01-.75.75H7.612l2.158 1.96a.75.75 0 11-1.04 1.08l-3.5-3.25a.75.75 0 010-1.08l3.5-3.25a.75.75 0 111.04 1.08L7.612 9.25h6.638A.75.75 0 0115 10z"
              clipRule="evenodd"
            />
          </svg>{" "}
          Back
        </Link>
        <h1 className="text-3xl font-extrabold pb-6">
          Privacy Policy for {config.appName}
        </h1>

        <div className="prose prose-sm md:prose-base lg:prose-lg max-w-none">
          <ReactMarkdown>{privacyPolicyContent}</ReactMarkdown>
        </div>
      </div>
    </main>
  );
};

export default PrivacyPolicy;
