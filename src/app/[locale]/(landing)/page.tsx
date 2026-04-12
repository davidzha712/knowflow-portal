import { Hero } from "@/components/landing/hero"
import { ValueProps } from "@/components/landing/value-props"
import { Showcase } from "@/components/landing/showcase"
import { Pricing } from "@/components/landing/pricing"
import { SocialProof } from "@/components/landing/social-proof"
import { ContactForm } from "@/components/landing/contact-form"
import { CtaSection } from "@/components/landing/cta-section"

export default function LandingPage() {
  return (
    <>
      <Hero />
      <ValueProps />
      <Showcase />
      <div id="pricing">
        <Pricing />
      </div>
      <SocialProof />
      <div id="contact">
        <ContactForm />
      </div>
      <CtaSection />
    </>
  )
}
