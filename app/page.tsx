// import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/(home)/hero-section";
import { AboutOurSection } from "@/components/(home)/about-our";
import { OurProducts } from "@/components/(home)/our-products";
import { HowItWorks } from "@/components/(home)/how-it-works";
import { ClientSays } from "@/components/(home)/client-says";
// import { GuidanceSection } from "@/components/(home)/guidance-section";
// import { TestimonialsSection } from "@/components/testimonials-section"
// import { ProgressSection } from "@/components/(home)/progress-section";
import { BeforeFooterSection } from "@/components/(home)/before-footer-section";
// import { Footer } from "@/components/footer"
import { Navbar } from "@/components/(layout-wrapper)/navbar";
import { Footer } from "@/components/(layout-wrapper)/footer";

export default function Home() {
  return (
    <div className="w-full bg-background dark:bg-background text-foreground">
      {/* <Navbar /> */}
      <main>
        <Navbar />
        <HeroSection />
        <AboutOurSection />
        <OurProducts />
        <HowItWorks />
        <ClientSays />

        {/* <TestimonialsSection /> */}
        {/* <ProgressSection /> */}
        {/* <GuidanceSection /> */}
        <BeforeFooterSection />
        <Footer />
      </main>
      {/* <Footer /> */}
    </div>
  );
}
