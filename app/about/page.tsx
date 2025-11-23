import { OurPurpose } from "@/components/(about-us)/our-purpose";
import { WhoWeAre } from "@/components/(about-us)/who-we-are";
import { OurExpertise } from "@/components/(about-us)/our-expertise";
import { Navbar } from "@/components/(layout-wrapper)/navbar";
import { Footer } from "@/components/(layout-wrapper)/footer";
import { OurLeaders } from "@/components/(about-us)/our-leaders";
import { BeforeFooter } from "@/components/(about-us)/before-footer";
import { Questions } from "@/components/(about-us)/questions";

export default function About() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 text-vulcan-dark-blue">
        <Navbar />
        <WhoWeAre />
        <OurPurpose />
        <OurExpertise />
        <OurLeaders />
        <Questions />
        <BeforeFooter />
        <Footer />
      </main>
    </div>
  );
}
