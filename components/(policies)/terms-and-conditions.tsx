import Image from "next/image";

export function TermsAndConditions() {
  return (
    <section className="w-full min-h-screen py-20 md:px-12">
      <div className="w-full">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 mb-16">
          {/* Left Content */}
          <div className="w-full lg:w-1/2 text-left md:py-16">
            <h1 className="mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-vulcan-accent-blue">
              Terms and Conditions
            </h1>
            <p className="mb-8 text-base sm:text-lg md:text-xl text-foreground/80 leading-relaxed">
              Please read these Terms and Conditions carefully before using our
              website. By accessing Vulcans, you agree to be bound by these terms.
            </p>
            <p className="text-sm text-foreground/70">
              Last updated: <span className="font-medium">March 23, 2024</span>
            </p>
          </div>

          {/* Right Image */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <Image
              src="/terms.png"
              alt="Terms and Conditions Illustration"
              width={400}
              height={400}
              className="rounded-xl shadow-lg"
            />
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-16">
          
          {/* Section 1 */}
          <div>
            <h2 className="mb-4 text-2xl md:text-3xl font-light tracking-tight text-vulcan-accent-blue">
              1. Terms
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-foreground/80">
              By accessing this Website, accessible from 
              <a href="https://vulcans.in" className="text-vulcan-bright-cyan underline hover:text-vulcan-accent-blue transition-colors ml-1">
                https://vulcans.in
              </a>, 
              you are agreeing to be bound by these Terms and Conditions of Use. 
              If you disagree with any of these terms, you are prohibited from using this site.
            </p>
          </div>

          {/* Section 2 */}
          <div>
            <h2 className="mb-4 text-2xl md:text-3xl font-light tracking-tight text-vulcan-accent-blue">
              2. Use License
            </h2>
            <ul className="list-disc pl-6 space-y-3 text-base md:text-lg leading-relaxed text-foreground/80">
              <li>Permission is granted to temporarily download one copy of the materials for personal, non-commercial viewing only.</li>
              <li>You may not modify, copy, or use the materials for commercial purposes.</li>
              <li>You may not attempt to reverse engineer any software contained on Vulcans's Website.</li>
              <li>You may not remove copyright or proprietary notices.</li>
              <li>You may not transfer or "mirror" the materials on any other server.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div>
            <h2 className="mb-4 text-2xl md:text-3xl font-light tracking-tight text-vulcan-accent-blue">
              3. Disclaimer
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-foreground/80">
              All materials on Vulcans's Website are provided "as is". Vulcans makes no warranties, expressed or implied, 
              and hereby disclaims all warranties, including accuracy, reliability, or fitness for a particular purpose.
            </p>
          </div>

          {/* Section 4 */}
          <div>
            <h2 className="mb-4 text-2xl md:text-3xl font-light tracking-tight text-vulcan-accent-blue">
              4. Limitations
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-foreground/80">
              Vulcans or its suppliers will not be held accountable for any damages arising from the use or inability to use 
              the materials on Vulcans's Website, even if notified of the possibility of such damages.
            </p>
          </div>

          {/* Section 5 */}
          <div>
            <h2 className="mb-4 text-2xl md:text-3xl font-light tracking-tight text-vulcan-accent-blue">
              5. Revisions and Errata
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-foreground/80">
              The materials appearing on Vulcans's Website may include errors. Vulcans does not warrant that any content 
              is accurate or current and may change materials at any time without notice.
            </p>
          </div>

          {/* Section 6 */}
          <div>
            <h2 className="mb-4 text-2xl md:text-3xl font-light tracking-tight text-vulcan-accent-blue">
              6. Links
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-foreground/80">
              Vulcans has not reviewed all linked sites and is not responsible for their content. The use of any linked 
              website is at the user's own risk.
            </p>
          </div>

          {/* Section 7 */}
          <div>
            <h2 className="mb-4 text-2xl md:text-3xl font-light tracking-tight text-vulcan-accent-blue">
              7. Site Terms Modifications
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-foreground/80">
              Vulcans may revise these Terms at any time without prior notice. By using this Website, 
              you agree to be bound by the latest version.
            </p>
          </div>

          {/* Section 8 */}
          <div>
            <h2 className="mb-4 text-2xl md:text-3xl font-light tracking-tight text-vulcan-accent-blue">
              8. Your Privacy
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-foreground/80">
              Please read our{" "}
              <a href="/privacy-policy" className="text-vulcan-bright-cyan underline hover:text-vulcan-accent-blue transition-colors">
                Privacy Policy
              </a>.
            </p>
          </div>

          {/* Section 9 */}
          <div>
            <h2 className="mb-4 text-2xl md:text-3xl font-light tracking-tight text-vulcan-accent-blue">
              9. Governing Law
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-foreground/80">
              Any claim related to Vulcans's Website shall be governed by the laws of India without 
              regard to its conflict of law provisions.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
