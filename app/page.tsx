import { auth } from "@/auth"
import {
  Navbar,
  Hero,
  FeaturesSection,
  HowItWorks,
  CtaBanner,
  Footer,
} from "@/features/landing"

export default async function Page() {
  const session = await auth()

  return (
    <>
      <Navbar isLoggedIn={!!session} />
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
