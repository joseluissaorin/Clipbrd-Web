import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

// CHATGPT PROMPT TO GENERATE YOUR TERMS & SERVICES — replace with your own data 👇

// 1. Go to https://chat.openai.com/
// 2. Copy paste bellow
// 3. Replace the data with your own (if needed)
// 4. Paste the answer from ChatGPT directly in the <pre> tag below

// You are an excellent lawyer.

// I need your help to write a simple Terms & Services for my website. Here is some context:
// - Website: https://shipfa.st
// - Name: ShipFast
// - Contact information: marc@shipfa.st
// - Description: A JavaScript code boilerplate to help entrepreneurs launch their startups faster
// - Ownership: when buying a package, users can download code to create apps. They own the code but they do not have the right to resell it. They can ask for a full refund within 7 day after the purchase.
// - User data collected: name, email and payment information
// - Non-personal data collection: web cookies
// - Link to privacy-policy: https://shipfa.st/privacy-policy
// - Governing Law: France
// - Updates to the Terms: users will be updated by email

// Please write a simple Terms & Services for my site. Add the current date. Do not add or explain your reasoning. Answer:

export const metadata = getSEOTags({
  title: `Terms and Conditions | ${config.appName}`,
  canonicalUrlRelative: "/tos",
});

const TOS = () => {
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
          </svg>
          Back
        </Link>
        <h1 className="text-3xl font-extrabold pb-6">
          Terms and Conditions for {config.appName}
        </h1>

        <pre
          className="leading-relaxed whitespace-pre-wrap"
          style={{ fontFamily: "sans-serif" }}
        >
          {`**Terms & Services**  
*Effective Date: October 13, 2024*

Welcome to Clipbrd. By using the Clipbrd software or any services provided through our website (https://clipbrdapp.com), you agree to comply with and be bound by the following Terms & Services.

### 1. Ownership and License  
Clipbrd is an AI-driven clipboard manager. While your subscription is active, you are granted a key to register and use the program. You may not distribute, resell, or transfer the program or registration key to any third party.

### 2. User Data  
We collect your name, email, and payment information to provide our services. For further details on how we handle your personal data, please refer to our Privacy Policy at [https://clipbrdapp.com/privacy-policy](https://clipbrdapp.com/privacy-policy).

### 3. Non-Personal Data  
We collect non-personal data, such as web cookies, to improve the user experience and for analytical purposes.

### 4. Termination  
We reserve the right to terminate your access to Clipbrd in the event of any violation of these terms.

### 5. Governing Law  
These Terms & Services are governed by the laws of Spain.

### 6. Updates  
We may update these terms from time to time. Any changes will be communicated to you by email.

For any questions or concerns, please contact us at jl@clipbrdapp.com.

Thank you for using Clipbrd!`}
        </pre>
      </div>
    </main>
  );
};

export default TOS;
