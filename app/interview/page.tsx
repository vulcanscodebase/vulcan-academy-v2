// import { Navbar } from "@/components/(layout-wrapper)/navbar";
import { Footer } from "@/components/(layout-wrapper)/footer";
import { CourseSection } from "@/components/(interview-master)/coursessection";
import Image from "next/image";

export default function InterviewPage(){
    return(
        <>
        {/* Hero Section */}
        <section className="relative w-full py-16 md:py-24 lg:py-32 bg-white">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/hero-section.png"
                  alt="Vulcan Interview Master"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>
        <CourseSection />
        <Footer />
        </>
    )
}