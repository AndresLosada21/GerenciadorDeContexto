"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import TryItNow from "@/components/TryItNow";
import Footer from "@/components/Footer";
import AOSInit from "@/components/AOSInit";

export default function Home() {
  return (
    <>
      <AOSInit />
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <TryItNow />
      <Footer />
    </>
  );
}
