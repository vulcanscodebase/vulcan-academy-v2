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
              This website namely Vulcans.co.in and Vulcanprep.com is owned by Vulcan Learning Collective LLP (hereinafter referred to as "Vulcan") specialising in providing a broad spectrum of educational services aimed at fostering skill development and professional growth.
            </p>
            <p className="text-sm text-foreground/70">
              Last updated: <span className="font-medium">March 23, 2024</span>
            </p>
          </div>

          {/* Right Image */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <Image
              src="/vulcans-logo.png"
              alt="Terms and Conditions Illustration"
              width={400}
              height={400}
              className="rounded-xl shadow-lg"
            />
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-16">
          
          {/* Section 1 - Introduction */}
          <div>
            <h2 className="mb-4 text-2xl md:text-3xl font-light tracking-tight text-vulcan-accent-blue">
              1. Introduction
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-foreground/80">
              This website namely Vulcans.co.in and Vulcanprep.com is owned by Vulcan Learning Collective LLP (hereinafter referred to as "Vulcan") specialising in providing a broad spectrum of educational services aimed at fostering skill development and professional growth. Our offerings include personalized education and training programs, Interview assessment and certification, comprehensive placement services, and extensive language skill-building workshops. By accessing and using our website and services, users engage with a rich repository of educational content designed to empower and elevate their career trajectories.
            </p>
          </div>

          {/* Section 2 - User Agreement */}
          <div>
            <h2 className="mb-4 text-2xl md:text-3xl font-light tracking-tight text-vulcan-accent-blue">
              2. User Agreement
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-foreground/80">
              By accessing, browsing, or using VULCAN's website and services, users signify their agreement to be bound by these terms and conditions. If you disagree with any part of the terms, you must discontinue use of our services immediately.
            </p>
          </div>

          {/* Section 3 - Terms */}
          <div>
            <h2 className="mb-4 text-2xl md:text-3xl font-light tracking-tight text-vulcan-accent-blue">
              3. Terms
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-foreground/80">
              By accessing Vulcans.in, you agree to abide by these terms and acknowledge your responsibility to comply with applicable local laws. Disagreement with any term prohibits access to this site. Materials on this website are protected by copyright law, trademark law and such other ancillary laws.
            </p>
          </div>

          {/* Section 4 - Use License */}
          <div>
            <h2 className="mb-4 text-2xl md:text-3xl font-light tracking-tight text-vulcan-accent-blue">
              4. Use License
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-foreground/80 mb-4">
              Permission is granted to temporarily download one copy of the materials on Vulcans.co.in for personal, non-commercial transitory viewing only. This is a license grant, not a transfer of title. Under this license, you may not:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-base md:text-lg leading-relaxed text-foreground/80">
              <li>Modify or copy the materials.</li>
              <li>Use the materials for any commercial purpose or public display.</li>
              <li>Attempt to reverse engineer any software on the website.</li>
              <li>Remove any copyright or proprietary notations from the materials.</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
            </ul>
            <p className="text-base md:text-lg leading-relaxed text-foreground/80 mt-4">
              Violations may result in termination by Vulcans. Upon termination, your viewing rights cease, and downloaded materials must be destroyed.
            </p>
          </div>

          {/* Section 5 - Service Description */}
          <div>
            <h2 className="mb-4 text-2xl md:text-3xl font-light tracking-tight text-vulcan-accent-blue">
              5. Service Description
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-foreground/80 mb-4">
              VULCAN offers:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-base md:text-lg leading-relaxed text-foreground/80">
              <li><strong>Education and Training:</strong> Customized learning modules catering to diverse professional fields.</li>
              <li><strong>Interview Assessment and Certification:</strong> Rigorous evaluation tools to simulate interviews, followed by certification.</li>
              <li><strong>Placement Services:</strong> Dedicated support in securing employment opportunities post-certification.</li>
              <li><strong>Verbal Aptitude Coaching:</strong> Specialized coaching sessions aimed at enhancing verbal skills.</li>
              <li><strong>Language Skill Building:</strong> Comprehensive programs designed to improve overall language proficiency.</li>
            </ul>
          </div>

          {/* Section 6 - User Responsibilities */}
          <div>
            <h2 className="mb-4 text-2xl md:text-3xl font-light tracking-tight text-vulcan-accent-blue">
              6. User Responsibilities
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-foreground/80 mb-4">
              Users must:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-base md:text-lg leading-relaxed text-foreground/80">
              <li>Comply with all applicable laws and these terms.</li>
              <li>Provide accurate information during registration.</li>
              <li>Not engage in any activity that disrupts or interferes with our services.</li>
              <li>Respect the intellectual property rights of VULCAN and third parties.</li>
            </ul>
          </div>

          {/* Section 7 - Intellectual Property Rights */}
          <div>
            <h2 className="mb-4 text-2xl md:text-3xl font-light tracking-tight text-vulcan-accent-blue">
              7. Intellectual Property Rights
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-foreground/80">
              All content on VULCAN's platform, including text, graphics, logos, and software, is the property of VULCAN or its licensors and is protected by copyright and intellectual property laws. Unauthorized use is prohibited.
            </p>
          </div>

          {/* Section 8 - Privacy Policy */}
          <div>
            <h2 className="mb-4 text-2xl md:text-3xl font-light tracking-tight text-vulcan-accent-blue">
              8. Privacy Policy
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-foreground/80">
              Refer to our detailed{" "}
              <a href="/privacy-policy" className="text-vulcan-bright-cyan underline hover:text-vulcan-accent-blue transition-colors">
                Privacy Policy
              </a>{" "}
              for information on how we collect, use, and protect your data.
            </p>
          </div>

          {/* Section 9 - Disclaimer */}
          <div>
            <h2 className="mb-4 text-2xl md:text-3xl font-light tracking-tight text-vulcan-accent-blue">
              9. Disclaimer
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-foreground/80">
              All materials on Vulcans.in are provided "as is" without warranty of any kind, whether expressed or implied. Vulcans disclaims all other warranties and makes no representations regarding the accuracy or reliability of the materials.
            </p>
          </div>

          {/* Section 10 - Revisions and Errata */}
          <div>
            <h2 className="mb-4 text-2xl md:text-3xl font-light tracking-tight text-vulcan-accent-blue">
              10. Revisions and Errata
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-foreground/80">
              Vulcans does not warrant that the materials on its website are accurate, complete, or current. Vulcans reserves the right to modify materials at any time without notice.
            </p>
          </div>

          {/* Section 11 - Limitation of Liability */}
          <div>
            <h2 className="mb-4 text-2xl md:text-3xl font-light tracking-tight text-vulcan-accent-blue">
              11. Limitation of Liability
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-foreground/80">
              VULCAN shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from the use of or inability to use our services.
            </p>
          </div>

          {/* Section 12 - Links */}
          <div>
            <h2 className="mb-4 text-2xl md:text-3xl font-light tracking-tight text-vulcan-accent-blue">
              12. Links
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-foreground/80">
              Vulcans is not responsible for the content of linked websites. Inclusion of any link does not imply endorsement. Use of linked sites is at the user's risk.
            </p>
          </div>

          {/* Section 13 - Site Terms of Use Modifications */}
          <div>
            <h2 className="mb-4 text-2xl md:text-3xl font-light tracking-tight text-vulcan-accent-blue">
              13. Site Terms of Use Modifications
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-foreground/80">
              Vulcans may revise these Terms of Use & Terms of Service without prior notice. By using this website, you agree to be bound by the current version.
            </p>
          </div>

          {/* Section 14 - Governing Law */}
          <div>
            <h2 className="mb-4 text-2xl md:text-3xl font-light tracking-tight text-vulcan-accent-blue">
              14. Governing Law
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-foreground/80">
              These terms are governed by the laws of Karnataka, India, without regard to its conflict of law provisions.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
