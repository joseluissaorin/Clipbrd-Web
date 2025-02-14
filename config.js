import themes from "daisyui/src/theming/themes";

const config = {
  // REQUIRED
  appName: "Clipbrd",
  // REQUIRED: a short description of your app for SEO tags
  appDescription: "Your AI-Powered Study Companion - Transform your learning experience with intelligent clipboard management",
  // REQUIRED (no https://, not trialing slash at the end)
  domainName: "clipbrdapp.com",
  crisp: {
    // Crisp website ID
    id: "",
    // Hide Crisp by default, except on route "/"
    onlyShowOnRoutes: ["/"],
  },
  stripe: {
    plans: [
      {
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_1QsC742NW4zJ1dDkNSlnP8YY"
            : "price_1QsC742NW4zJ1dDkNSlnP8YY",
        name: "Monthly",
        description: "Transform your learning experience",
        price: 3.99,
        features: [
          { name: "AI-Powered Assistance" },
          { name: "Context-Aware Learning" },
          { name: "Image Support" },
          { name: "Universal Compatibility" },
          { name: "Smart MCQ Support" },
          { name: "Priority Support" },
        ],
      },
    ],
  },
  aws: {
    bucket: "clipbrd-assets",
    bucketUrl: `https://clipbrd-assets.s3.amazonaws.com/`,
    cdn: "https://cdn.clipbrdapp.com/",
  },
  mailgun: {
    subdomain: "mail",
    fromNoReply: `Clipbrd <noreply@mail.clipbrdapp.com>`,
    fromAdmin: `JL at Clipbrd <jl@mail.clipbrdapp.com>`,
    supportEmail: "jl@mail.clipbrdapp.com",
    forwardRepliesTo: "jlsf2005@gmail.com",
  },
  colors: {
    theme: "light",
    main: themes["light"]["primary"],
  },
  auth: {
    loginUrl: "/signin",
    callbackUrl: "/dashboard",
  },
};

export default config;
