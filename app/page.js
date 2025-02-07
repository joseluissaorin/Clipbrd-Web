import { Suspense } from 'react'
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import FeaturesAccordion from "@/components/FeaturesAccordion";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import ScrollAnimation from "@/components/ScrollAnimation";
import BlurOverlay from "@/components/BlurOverlay";

export default function Home() {
  return (
    <>
      <Suspense>
        <Header />
      </Suspense>
      <main>
        <ScrollAnimation>
          <Hero />
        </ScrollAnimation>
        <ScrollAnimation>
          <Problem />
        </ScrollAnimation>
        <ScrollAnimation>
          <FeaturesAccordion />
        </ScrollAnimation>
        <ScrollAnimation>
          <Pricing />
        </ScrollAnimation>
        <ScrollAnimation>
          <FAQ />
        </ScrollAnimation>
        <ScrollAnimation>
          <CTA />
        </ScrollAnimation>
      </main>
      <Footer />
      <BlurOverlay />
    </>
  );
}