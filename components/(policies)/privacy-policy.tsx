import Image from "next/image";

export function PrivacyPolicy() {
  return (
    <section className="w-full min-h-screen py-20 md:px-12">
      <div className="w-full ">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 mb-16">
          {/* Left Content */}
          <div className="w-full lg:w-1/2 text-left md:py-16">
            <h1 className="mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-vulcan-accent-blue">
              Privacy Policy
            </h1>
            <p className="mb-8 text-base sm:text-lg md:text-xl text-foreground/80 leading-relaxed">
              This Privacy Policy describes Our policies and procedures regarding the collection, use, and disclosure of Your information when You use the Service and informs You about Your privacy rights and how the law protects You.
            </p>
            <p className="text-sm text-foreground/70">
              By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy.
            </p>
          </div>

          {/* Right Image */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <Image
              src="/Privacy & Policy.png"
              alt="Privacy Policy Illustration"
              width={400}
              height={400}
              className="rounded-xl shadow-lg"
            />
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-16">
          
          {/* Interpretation and Definitions */}
          <div>
            <h2 className="mb-6 text-2xl md:text-3xl font-light tracking-tight text-vulcan-accent-blue">
              Interpretation and Definitions
            </h2>
            
            <div className="mb-8">
              <h3 className="mb-4 text-xl md:text-2xl font-medium tracking-tight text-foreground">
                Interpretation:
              </h3>
              <p className="text-base md:text-lg leading-relaxed text-foreground/80">
                Words with initial capitalization have defined meanings under specific conditions. The following definitions apply regardless of singular or plural use.
              </p>
            </div>

            <div>
              <h3 className="mb-4 text-xl md:text-2xl font-medium tracking-tight text-foreground">
                Definitions:
              </h3>
              <div className="space-y-4 text-base md:text-lg leading-relaxed text-foreground/80">
                <p><strong>Account:</strong> A unique account created for You to access our Service or its parts.</p>
                <p><strong>Affiliate:</strong> An entity controlling, controlled by, or under common control with us.</p>
                <p><strong>Company:</strong> Refers to Vulcans LLP.</p>
                <p><strong>Cookies:</strong> Small files placed on Your computer, mobile device, or any other device by a website, containing details of Your browsing history.</p>
                <p><strong>Country:</strong> Karnataka, India.</p>
                <p><strong>Device:</strong> Any tool capable of accessing our Service (e.g., computer, cellphone).</p>
                <p><strong>Personal Data:</strong> Any information related to an identified or identifiable individual.</p>
                <p><strong>Service:</strong> Our website, Vulcans.</p>
                <p><strong>Service Provider:</strong> Any entity processing data on behalf of the Company.</p>
                <p><strong>Usage Data:</strong> Information collected automatically during Service use.</p>
                <p><strong>Website:</strong> Vulcans, accessible from https:vulcans.in.</p>
                <p><strong>You:</strong> The individual or legal entity accessing or using our Service.</p>
              </div>
            </div>
          </div>

          {/* Data Collection */}
          <div>
            <h2 className="mb-4 text-2xl md:text-3xl font-light tracking-tight text-vulcan-accent-blue">
              1. Data Collection:
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-foreground/80">
              We collect personal information such as name, email address, and payment details, as well as non-personally identifiable information through cookies and other tracking technologies.
            </p>
          </div>

          {/* Tracking Technologies and Cookies */}
          <div>
            <h2 className="mb-4 text-2xl md:text-3xl font-light tracking-tight text-vulcan-accent-blue">
              2. Tracking Technologies and Cookies:
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-foreground/80 mb-4">
              We use cookies and similar tracking technologies to improve and analyze our service.
            </p>
            <p className="text-base md:text-lg leading-relaxed text-foreground/80">
              Cookies can be session or persistent, and we use them for essential functions, cookies policy acceptance, and functionality enhancement.
            </p>
          </div>

          {/* Data Use */}
          <div>
            <h2 className="mb-4 text-2xl md:text-3xl font-light tracking-tight text-vulcan-accent-blue">
              3. Data Use:
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-foreground/80">
              Collected data is used to provide and improve our services, process payments, communicate with users, and for marketing purposes with user consent.
            </p>
          </div>

          {/* Data Sharing */}
          <div>
            <h2 className="mb-4 text-2xl md:text-3xl font-light tracking-tight text-vulcan-accent-blue">
              4. Data Sharing:
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-foreground/80">
              We may share data with third parties for service provision, legal compliance, or with user consent. We do not sell personal information to third parties.
            </p>
          </div>

          {/* User Rights */}
          <div>
            <h2 className="mb-4 text-2xl md:text-3xl font-light tracking-tight text-vulcan-accent-blue">
              5. User Rights:
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-foreground/80">
              Users have the right to access, correct, or delete their personal data held by VULCAN. Requests can be made via the contact details provided.
            </p>
          </div>

          {/* Data Security */}
          <div>
            <h2 className="mb-4 text-2xl md:text-3xl font-light tracking-tight text-vulcan-accent-blue">
              6. Data Security:
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-foreground/80">
              VULCAN implements industry-standard security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal data.
            </p>
          </div>

          {/* Disclaimer */}
          <div>
            <h2 className="mb-4 text-2xl md:text-3xl font-light tracking-tight text-vulcan-accent-blue">
              Disclaimer
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-xl md:text-2xl font-medium tracking-tight text-foreground">
                  1. Accuracy of Information:
                </h3>
                <p className="text-base md:text-lg leading-relaxed text-foreground/80">
                  While VULCAN strives to provide accurate and up-to-date information, we cannot guarantee the completeness, accuracy, or availability of our content.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-xl md:text-2xl font-medium tracking-tight text-foreground">
                  2. No Guarantees:
                </h3>
                <p className="text-base md:text-lg leading-relaxed text-foreground/80">
                  VULCAN does not guarantee specific outcomes from the use of our services, such as employment or certification success.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-xl md:text-2xl font-medium tracking-tight text-foreground">
                  3. Third-Party Links:
                </h3>
                <p className="text-base md:text-lg leading-relaxed text-foreground/80">
                  Our website may contain links to third-party websites. VULCAN is not responsible for the content or privacy practices of these sites.
                </p>
              </div>
            </div>
          </div>

          {/* Cookies Policy */}
          <div>
            <h2 className="mb-4 text-2xl md:text-3xl font-light tracking-tight text-vulcan-accent-blue">
              Cookies Policy
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-xl md:text-2xl font-medium tracking-tight text-foreground">
                  1. Use of Cookies:
                </h3>
                <p className="text-base md:text-lg leading-relaxed text-foreground/80">
                  VULCAN uses cookies to enhance user experience, analyse site usage, and personalize content and ads.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-xl md:text-2xl font-medium tracking-tight text-foreground">
                  2. Consent:
                </h3>
                <p className="text-base md:text-lg leading-relaxed text-foreground/80">
                  Users consent to our use of cookies by continuing to use our website. Consent can be withdrawn at any time by adjusting browser settings.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-xl md:text-2xl font-medium tracking-tight text-foreground">
                  3. Managing Cookies:
                </h3>
                <p className="text-base md:text-lg leading-relaxed text-foreground/80">
                  Instructions for managing cookies can be found in your browser's help documentation. Disabling cookies may limit your use of certain features on our website.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Us */}
          <div>
            <h2 className="mb-4 text-2xl md:text-3xl font-light tracking-tight text-vulcan-accent-blue">
              Contact Us:
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-foreground/80">
              If you have any questions about this Privacy Policy, you can contact us by email:{" "}
              <a 
                href="mailto:info@vulcans.in" 
                className="text-vulcan-bright-cyan underline hover:text-vulcan-accent-blue transition-colors"
              >
                info@vulcans.in
              </a>.
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}
