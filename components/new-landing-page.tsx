"use client"

import { useI18n } from "./i18n-provider"
import Navbar from "./navbar"
import HeroSection from "./hero-section"
import FeaturesSection from "./features-section"
import ModelsSection from "./models-section"
import FaqSection from "./faq-section"
import CtaSection from "./cta-section"
import Footer from "./footer"

export default function LandingPage() {
  const { dir } = useI18n()

  return (
    <div className="flex min-h-screen flex-col" dir={dir}>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <ModelsSection />
      <FaqSection />
      <CtaSection />
      <Footer />
    </div>
  )
}
