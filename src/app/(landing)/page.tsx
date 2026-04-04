import { Hero } from "@/components/landing/hero"
import { Features } from "@/components/landing/features"
import { Architecture } from "@/components/landing/architecture"
import { Pricing } from "@/components/landing/pricing"
import { ContactForm } from "@/components/landing/contact-form"

export default function LandingPage() {
  return (
    <>
      <Hero />
      <div id="features">
        <Features />
      </div>
      <div id="architecture">
        <Architecture />
      </div>
      <div id="pricing">
        <Pricing />
      </div>
      <div id="contact">
        <ContactForm />
      </div>
    </>
  )
}
