import {
  Navbar,
  Hero,
  FeaturesSection,
  HowItWorks,
  CtaBanner,
  Footer,
} from "@/features/landing"

export default function Page() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FeaturesSection />
        <HowItWorks />
        <CtaBanner />
      </main>
      <Footer />
    </>
  )
}
