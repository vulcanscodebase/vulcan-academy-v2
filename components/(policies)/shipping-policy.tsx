import Image from "next/image";

export function ShippingPolicy() {
  return (
    <section className="w-full min-h-screen py-20 md:px-12">
      <div className="w-full ">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 mb-16">
          {/* Left Content */}
          <div className="w-full lg:w-1/2 text-left md:py-16">
            <h1 className="mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-vulcan-accent-blue">
              Shipping Policy
            </h1>
            <p className="mb-8 text-base sm:text-lg md:text-xl text-foreground/80 leading-relaxed">
              Our code of conduct and your pledge to be an upstanding member of the product.  
              Please read carefully to understand how we handle your personal data.  
            </p>
            <p className="text-sm text-foreground/70">
              Effective Date: <span className="font-medium">March 17, 2025</span>
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
          
          {/* Section 1 */}
          <div>
            <h2 className="mb-4 text-2xl md:text-3xl font-light tracking-tight text-vulcan-accent-blue">
              1. Introduction
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-foreground/80">
              Welcome to <span className="font-semibold">Vulcans.in</span>.  
              We are committed to protecting your privacy and ensuring that your 
              personal information is handled securely and responsibly.  
              This Privacy Policy explains how we collect, use, and protect your data.
            </p>
          </div>

          {/* Section 2 */}
          <div>
            <h2 className="mb-4 text-2xl md:text-3xl font-light tracking-tight text-vulcan-accent-blue">
              2. Information We Collect
            </h2>
            <ul className="list-disc pl-6 space-y-3 text-base md:text-lg leading-relaxed text-foreground/80">
              <li><strong>Personal Information:</strong> Name, email, phone number, billing and shipping addresses.</li>
              <li><strong>Account Information:</strong> Login credentials and preferences.</li>
              <li><strong>Transaction Details:</strong> Order history, payment confirmations.</li>
              <li><strong>Technical Data:</strong> IP address, device details, cookies.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div>
            <h2 className="mb-4 text-2xl md:text-3xl font-light tracking-tight text-vulcan-accent-blue">
              3. How We Use Your Information
            </h2>
            <ul className="list-disc pl-6 space-y-3 text-base md:text-lg leading-relaxed text-foreground/80">
              <li>To process and fulfill your orders.</li>
              <li>To improve website functionality and user experience.</li>
              <li>To send transactional and promotional communications.</li>
              <li>To prevent fraud and enhance security measures.</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div>
            <h2 className="mb-4 text-2xl md:text-3xl font-light tracking-tight text-vulcan-accent-blue">
              4. Data Security
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-foreground/80">
              We implement security measures to protect your data from unauthorized access.  
              However, no online platform is 100% secure, and we encourage you to use strong 
              passwords and keep your account details private.
            </p>
          </div>

          {/* Section 5 */}
          <div>
            <h2 className="mb-4 text-2xl md:text-3xl font-light tracking-tight text-vulcan-accent-blue">
              5. Third-Party Sharing
            </h2>
            <p className="mb-4 text-base md:text-lg leading-relaxed text-foreground/80">
              We do not sell your data. However, we may share it with trusted third parties:
            </p>
            <ul className="list-disc pl-6 space-y-3 text-base md:text-lg leading-relaxed text-foreground/80">
              <li>Payment processors for secure transactions.</li>
              <li>Shipping partners to fulfill your orders.</li>
              <li>Legal authorities if required by law.</li>
            </ul>
          </div>

          {/* Section 6 */}
          <div>
            <h2 className="mb-4 text-2xl md:text-3xl font-light tracking-tight text-vulcan-accent-blue">
              6. Your Rights
            </h2>
            <ul className="list-disc pl-6 space-y-3 text-base md:text-lg leading-relaxed text-foreground/80">
              <li>Access, update, or delete your personal data.</li>
              <li>Opt-out of marketing emails.</li>
              <li>Request a copy of your stored data.</li>
            </ul>
          </div>

          {/* Section 7 */}
          <div>
            <h2 className="mb-4 text-2xl md:text-3xl font-light tracking-tight text-vulcan-accent-blue">
              7. Shipping Policy
            </h2>
            <ul className="list-disc pl-6 space-y-3 text-base md:text-lg leading-relaxed text-foreground/80">
              <li><strong>Order Processing:</strong> Orders are processed within 1-3 business days.</li>
              <li>
                <strong>Shipping Methods & Delivery Time:</strong>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Standard Shipping: 5-7 business days.</li>
                  <li>Express Shipping: 2-4 business days.</li>
                  <li>International Shipping: 7-15 business days.</li>
                </ul>
              </li>
              <li><strong>Tracking:</strong> You will receive tracking details once your order is shipped.</li>
            </ul>
          </div>

          {/* Section 8 */}
          <div>
            <h2 className="mb-4 text-2xl md:text-3xl font-light tracking-tight text-vulcan-accent-blue">
              8. Contact Us
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-foreground/80">
              If you have any questions regarding this Privacy Policy, please contact us at{" "}
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
