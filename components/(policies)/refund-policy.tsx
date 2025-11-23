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
              Refund and Return Policy
            </h1>
            <p className="mb-8 text-base sm:text-lg md:text-xl text-foreground/80 leading-relaxed">
              Our return and refund policy ensures transparency and trust. 
              Please read carefully to understand how we handle cancellations, returns, and refunds. 
            </p>
            <p className="text-sm text-foreground/70">
              Last updated: <span className="font-medium">March 23, 2024</span>
            </p>
          </div>

          {/* Right Image */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <Image
              src="/Privacy & Policy.png"
              alt="Refund Policy Illustration"
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
              Interpretation
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-foreground/80">
              The words of which the initial letter is capitalized 
              have meanings defined under the following conditions. 
              The following definitions shall have the same meaning 
              regardless of whether they appear in singular or in plural.
            </p>
          </div>

          {/* Section 2 */}
          <div>
            <h2 className="mb-4 text-2xl md:text-3xl font-light tracking-tight text-vulcan-accent-blue">
              Definitions
            </h2>
            <p className="mb-4 text-base md:text-lg leading-relaxed text-foreground/80">
              For the purposes of this Return and Refund Policy:
            </p>
            <ul className="list-disc pl-6 space-y-3 text-base md:text-lg leading-relaxed text-foreground/80">
              <li><strong>Company:</strong> VULCAN LEARNING COLLECTIVE LLP, 13 VASISTA KALLODI, KALUR HOSANAGARA, Shimoga, 57741.</li>
              <li><strong>Goods:</strong> Items offered for sale on the Service.</li>
              <li><strong>Orders:</strong> Requests by You to purchase Goods from Us.</li>
              <li><strong>Service:</strong> The Website.</li>
              <li><strong>Website:</strong> Vulcans, accessible from <a href="https://vulcans.in" className="text-vulcan-bright-cyan underline hover:text-vulcan-accent-blue transition-colors">https://vulcans.in</a>.</li>
              <li><strong>You:</strong> The individual accessing or using the Service, or the company or other legal entity on behalf of which such individual is accessing or using the Service.</li>
            </ul>
          </div>

          {/* Section 3 - Cancellation Rights */}
          <div>
            <h2 className="mb-4 text-2xl md:text-3xl font-light tracking-tight text-vulcan-accent-blue">
              Your Order Cancellation Rights
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-foreground/80 mb-4">
              You are entitled to cancel Your Order within 7 days without giving any reason for doing so. 
              The deadline for cancelling an Order is 7 days from the date on which You received the Goods or 
              on which a third party you have appointed, who is not the carrier, takes possession of the product delivered.
            </p>
            <p className="text-base md:text-lg leading-relaxed text-foreground/80 mb-4">
              To exercise Your right of cancellation, You must inform Us of your decision by means of a clear statement. 
              You can inform us via:
            </p>
            <p className="text-base md:text-lg leading-relaxed text-foreground/80">
              Email: <a href="mailto:info@vulcans.in" className="text-vulcan-bright-cyan underline hover:text-vulcan-accent-blue transition-colors">info@vulcans.in</a>
            </p>
            <p className="text-base md:text-lg leading-relaxed text-foreground/80 mt-4">
              We will reimburse You no later than 14 days from the day on which We receive the returned Goods. 
              The reimbursement will use the same payment method as You used for the Order, and You will not incur any fees for such reimbursement.
            </p>
          </div>

          {/* Section 4 - Conditions for Returns */}
          <div>
            <h2 className="mb-4 text-2xl md:text-3xl font-light tracking-tight text-vulcan-accent-blue">
              Conditions for Returns
            </h2>
            <ul className="list-disc pl-6 space-y-3 text-base md:text-lg leading-relaxed text-foreground/80">
              <li>The Goods were purchased in the last 7 days.</li>
              <li>The Goods are in the original packaging.</li>
            </ul>
            <p className="mt-4 mb-2 text-base md:text-lg text-foreground/80">
              The following Goods cannot be returned:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-base md:text-lg leading-relaxed text-foreground/80">
              <li>Goods made to Your specifications or clearly personalized.</li>
              <li>Goods which deteriorate rapidly or have expired.</li>
              <li>Goods unsealed after delivery for hygiene reasons.</li>
              <li>Goods that are inseparably mixed with other items after delivery.</li>
            </ul>
          </div>

          {/* Section 5 - Returning Goods */}
          <div>
            <h2 className="mb-4 text-2xl md:text-3xl font-light tracking-tight text-vulcan-accent-blue">
              Returning Goods
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-foreground/80 mb-4">
              You are responsible for the cost and risk of returning the Goods to Us. Send them to:
            </p>
            <p className="text-base md:text-lg leading-relaxed text-foreground/80 font-semibold">
              13 VASISTA KALLODI, KALUR HOSANAGARA, Shimoga, 57741
            </p>
            <p className="text-base md:text-lg leading-relaxed text-foreground/80 mt-4">
              We recommend using an insured and trackable mail service. 
              We cannot process refunds without receiving the Goods or proof of return delivery.
            </p>
          </div>

          {/* Section 6 - Gifts */}
          <div>
            <h2 className="mb-4 text-2xl md:text-3xl font-light tracking-tight text-vulcan-accent-blue">
              Gifts
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-foreground/80">
              If the Goods were marked as a gift when purchased and then shipped directly to you, 
              You will receive a gift credit for the value of your return. 
              Once the returned product is received, a gift certificate will be mailed to You.
            </p>
          </div>

          {/* Section 7 - Contact */}
          <div>
            <h2 className="mb-4 text-2xl md:text-3xl font-light tracking-tight text-vulcan-accent-blue">
              Contact Us
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-foreground/80">
              If you have any questions about our Return and Refund Policy, please contact us:
            </p>
            <p className="text-base md:text-lg leading-relaxed text-foreground/80">
              Email: <a href="mailto:info@vulcans.in" className="text-vulcan-bright-cyan underline hover:text-vulcan-accent-blue transition-colors">info@vulcans.in</a>
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
