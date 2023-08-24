const config = {
  appName: "ShipFast",
  domainName: "shipfa.st",
  crisp: {
    id: "3878e3c2-74cb-498b-a360-4419fb8e7c9b",
    // If you want to show Crisp on every routes, just remove this below
    onlyShowOnRoutes: ["/"],
  },
  adminEmail: "",
  stripe: {
    plans: [
      {
        name: "Starter",
        priceId:
          process.env.NODE_ENV === "development" ? "price_123" : "price_456",
        price: 19,
        features: [
          {
            name: "Unlimited access",
          },
          { name: "24/7 support" },
        ],
      },
    ],
  },
  aws: {
    bucket: "bucket-name",
    bucketUrl: `https://bucket-name.s3.amazonaws.com/`,
    cdn: "https://cdn-id.cloudfront.net/",
  },
  mailgun: {
    // Email 'From' field to be used when sending magic login links
    fromNoReply: `ShipFast <noreply@mg.shipfa.st>`,
    // Email 'From' field to be used when sending other emails, like abandoned carts, updates etc..
    fromAdmin: `Marc at ShipFast <marc@mg.shipfa.st>`,
  },
  colors: {
    // This colors will be reflected on the whole app (loading bar, Chrome tabs, etc..)
    main: "#f37055",
  },
};

export default config;
