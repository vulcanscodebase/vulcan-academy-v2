import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function GetInTouch() {
  return (
    <section className="w-full py-20 md:py-32 lg:py-40 bg-background dark:bg-background">
      <div className="px-4 sm:px-6 md:px-12 lg:px-16 flex flex-col gap-12 lg:gap-16 items-start">

        {/* Left Side - Contact Info */}
        <div className="w-full space-y-8">
          <div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-foreground mb-4">
              Contact Us
            </h2>
            <p className="text-lg md:text-xl text-foreground/80 max-w-full lg:max-w-xl">
              Email, call, or complete the form to learn how Snappy can solve your message problem
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-foreground/80">info@vulcans.in</p>
              <p className="text-foreground/80">+91 6362 014 532</p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">Working Hours</h4>
              <p className="text-sm text-foreground/70">Mon - Fri : 9AM - 6PM</p>
              <p className="text-sm text-foreground/70">Sat : 10AM - 4PM</p>
            </div>

            <div>
              <h4 className="text-foreground mb-2">Customer Support</h4>
              <p className="text-foreground/70">
                Our support team is available around the clock to address any concerns or queries you may have.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Contact Form */}
        {/* <div className="w-full lg:w-1/2 bg-background p-6 sm:p-8 space-y-6 border rounded-3xl">
          <div>
            <h3 className="text-2xl md:text-3xl lg:text-4xl text-foreground mb-2">Get in Touch</h3>
          </div>

          <form className="space-y-6">
            <Input placeholder="Your Name" className="py-4 sm:py-6" />
            <Input type="email" placeholder="Your Email" className="py-4 sm:py-6" />
            <Input placeholder="Subject" className="py-4 sm:py-6" />
            <Textarea
              placeholder="Your Message"
              className="min-h-[120px] sm:min-h-[150px] resize-none py-3 sm:py-4"
            />
            <Button
              variant="default"
              className={cn(
                "bg-vulcan-accent-blue text-vulcan-white hover:bg-vulcan-accent-blue/90",
                "w-full rounded-md px-6 sm:px-8 py-4 sm:py-5 text-sm sm:text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              )}
            >
              Send Message
            </Button>
          </form>
        </div> */}

      </div>
    </section>
  )
}
