import Image from "next/image";

export function RefundPolicy() {
  return (
    <section className="w-full min-h-screen py-20 md:px-12">
      <div className="w-full">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 mb-16">
          {/* Left Content */}
          <div className="w-full lg:w-1/2 text-left md:py-16">
            <h1 className="mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-vulcan-accent-blue">
              Payment and Refund Policy
            </h1>
            <p className="mb-8 text-base sm:text-lg md:text-xl text-foreground/80 leading-relaxed">
              Thank you for choosing Vulcans. We are committed to providing the best experience possible. 
              Please read this Refunds and Cancellation Policy carefully before making any purchase or booking on our website 
              <a href="https://vulcans.co.in/" className="text-vulcan-bright-cyan underline hover:text-vulcan-accent-blue transition-colors">https://vulcans.co.in/</a>
            </p>
            <p className="text-sm text-foreground/70">
              Last updated: <span className="font-medium">February 13, 2025</span>
            </p>
          </div>

          {/* Right Image */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <Image
              src="/Privacy & Policy.png"
              alt="Payment and Refund Policy Illustration"
              width={400}
              height={400}
              className="rounded-xl shadow-lg"
            />
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-16">
          
          {/* Section 1 - Refunds */}
          <div>
            <h2 className="mb-4 text-2xl md:text-3xl font-light tracking-tight text-vulcan-accent-blue">
              1. Refunds
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 text-lg md:text-xl font-medium text-vulcan-accent-blue">
                  1.1. Eligibility for Refunds
                </h3>
                <p className="text-base md:text-lg leading-relaxed text-foreground/80">
                  Refunds are issued under specific circumstances and are subject to the terms and conditions outlined in this policy. 
                  Refund is issued only in the case of website failure, server crash etc. That involves technical error from VULCANS. 
                  Refund will not be issued in the case of internet, power issues or anything doesn't involve direct involvement of Vulcans.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-lg md:text-xl font-medium text-vulcan-accent-blue">
                  1.2. Product/Service Dependent Refund Policies
                </h3>
                <p className="text-base md:text-lg leading-relaxed text-foreground/80">
                  Each product or service offered on Vulcans may have its own refund policy. Please refer to the specific product or service page for details.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-lg md:text-xl font-medium text-vulcan-accent-blue">
                  1.3. Refund Requests
                </h3>
                <p className="text-base md:text-lg leading-relaxed text-foreground/80">
                  Refund requests must be made within the specified refund period mentioned for each product or service. 
                  Requests made after this period may not be entertained.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-lg md:text-xl font-medium text-vulcan-accent-blue">
                  1.4. Refund Processing Time
                </h3>
                <p className="text-base md:text-lg leading-relaxed text-foreground/80">
                  Refunds will be processed within 7 business days from the date of approval. 
                  The processing time may vary depending on the payment method and banking institution.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-lg md:text-xl font-medium text-vulcan-accent-blue">
                  1.5. Refund Method
                </h3>
                <p className="text-base md:text-lg leading-relaxed text-foreground/80">
                  Refunds will be issued using the same method of payment used for the original transaction unless otherwise specified.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-lg md:text-xl font-medium text-vulcan-accent-blue">
                  1.6. Non-Refundable Items/Services
                </h3>
                <p className="text-base md:text-lg leading-relaxed text-foreground/80">
                  Certain items or services may not be eligible for refunds. These include but are not limited to digital downloads, 
                  customized products/services, and non-cancellable bookings.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2 - Payment Policy */}
          <div>
            <h2 className="mb-4 text-2xl md:text-3xl font-light tracking-tight text-vulcan-accent-blue">
              2. Payment Policy
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 text-lg md:text-xl font-medium text-vulcan-accent-blue">
                  2.1. Payment Methods
                </h3>
                <p className="text-base md:text-lg leading-relaxed text-foreground/80 mb-4">
                  VULCAN accepts the following methods of payment for its services:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-base md:text-lg leading-relaxed text-foreground/80">
                  <li>Credit and Debit Cards (Visa, MasterCard, etc.)</li>
                  <li>Net Banking</li>
                  <li>Direct Bank Transfers</li>
                  <li>UPI</li>
                </ul>
              </div>

              <div>
                <h3 className="mb-2 text-lg md:text-xl font-medium text-vulcan-accent-blue">
                  2.2. Billing and Invoicing
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-base md:text-lg leading-relaxed text-foreground/80">
                  <li>Upon enrollment in any of VULCAN's services, clients will receive an invoice detailing the service charges.</li>
                  <li>Most services are pre-payment driven.</li>
                </ul>
              </div>

              <div>
                <h3 className="mb-2 text-lg md:text-xl font-medium text-vulcan-accent-blue">
                  2.3. Security
                </h3>
                <p className="text-base md:text-lg leading-relaxed text-foreground/80">
                  VULCAN employs robust security measures to protect the integrity and confidentiality of your personal and payment information. 
                  These include SSL encryption for data transmission and compliance with PCI DSS standards and our policies align with DPDPR - 2025.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3 - Contact Information */}
          <div>
            <h2 className="mb-4 text-2xl md:text-3xl font-light tracking-tight text-vulcan-accent-blue">
              3. Contact Information
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-foreground/80 mb-4">
              If you have any questions or concerns regarding our Refunds Policy, please contact us at:
            </p>
            <div className="space-y-3 text-base md:text-lg leading-relaxed text-foreground/80">
              <p><strong>Email:</strong> <a href="mailto:info@vulcans.in" className="text-vulcan-bright-cyan underline hover:text-vulcan-accent-blue transition-colors">info@vulcans.in</a></p>
              <p><strong>Phone:</strong> 6362014532</p>
              <p><strong>Address:</strong> 008, mechanical block, Alva's Institute of Engineering and technology, Mijar - 574227</p>
            </div>
            
            <div className="mt-6 p-4 bg-vulcan-accent-blue/10 rounded-lg">
              <p className="text-base md:text-lg leading-relaxed text-foreground/80">
                <strong>By using our website and/or purchasing our products/services, you acknowledge that you have read, understood, and agree to abide by the terms and conditions of this Refunds and Cancellation Policy.</strong>
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}