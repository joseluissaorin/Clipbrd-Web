import config from "@/config";
import ButtonCheckout from "./ButtonCheckout";

// <Pricing/> displays the pricing plans for your app
// It's your Stripe config in config.js.stripe.plans[] that will be used to display the plans
// <ButtonCheckout /> renders a button that will redirect the user to Stripe checkout called the /api/stripe/create-checkout API endpoint with the correct priceId

const Pricing = () => {
  return (
    <section id="pricing" className="bg-base-200">
      <div className="py-24 px-8 max-w-7xl mx-auto">
        <div className="flex flex-col text-center w-full mb-20">
          <h2 className="font-bold text-3xl lg:text-5xl tracking-tight">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg max-w-xl mx-auto text-base-content/80">
            Transform your study experience with intelligent clipboard management - Start today!
          </p>
        </div>

        <div className="relative flex justify-center flex-col lg:flex-row items-center lg:items-stretch gap-8">
          {config.stripe.plans.map((plan) => (
            <div key={plan.name} className="relative w-full max-w-lg">
              <div className="relative flex flex-col h-full gap-8 p-8 bg-base-100 rounded-3xl">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center gap-4">
                    <div>
                      <p className="text-lg font-medium">{plan.name}</p>
                      {plan.description && (
                        <p className="text-base-content/80">{plan.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4 items-end">
                    <div>
                      <p className="text-5xl font-bold">
                        €{plan.price}
                      </p>
                      <p className="text-base-content/60">per month</p>
                    </div>
                  </div>
                </div>

                <ButtonCheckout
                  priceId={plan.priceId}
                  mode="subscription"
                  className="btn btn-primary w-full"
                >
                  Get Started
                </ButtonCheckout>

                <div>
                  <p className="font-medium mb-4">Features</p>
                  <ul className="flex flex-col gap-4">
                    {plan.features.map((feature) => (
                      <li key={feature.name} className="flex gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-5 h-5 text-success shrink-0"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-base-content/80">
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
