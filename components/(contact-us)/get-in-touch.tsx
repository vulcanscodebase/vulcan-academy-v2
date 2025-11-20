import { Mail, Phone, Clock, Headphones } from "lucide-react"

export function GetInTouch() {
  return (
    <section className="w-full py-20 md:py-32 lg:py-40 bg-background dark:bg-background">
      <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-foreground mb-4">
              Contact Us
            </h2>
            <p className="text-lg md:text-xl text-foreground/80 dark:text-foreground/70 max-w-2xl mx-auto">
              Get in touch with us. We're here to help you with any questions or concerns.
            </p>
          </div>

          {/* Contact Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Email */}
            <div className="group p-6 rounded-2xl bg-card dark:bg-card border border-border hover:border-vulcan-accent-blue/50 dark:hover:border-vulcan-accent-blue/50 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-vulcan-accent-blue/10 dark:bg-vulcan-accent-blue/20 group-hover:bg-vulcan-accent-blue/20 dark:group-hover:bg-vulcan-accent-blue/30 transition-colors">
                  <Mail className="h-6 w-6 text-vulcan-accent-blue dark:text-vulcan-accent-blue" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground dark:text-foreground mb-2">Email</h3>
                  <a 
                    href="mailto:info@vulcans.in" 
                    className="text-foreground/80 dark:text-foreground/70 hover:text-vulcan-accent-blue dark:hover:text-vulcan-accent-blue transition-colors"
                  >
                    info@vulcans.in
                  </a>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="group p-6 rounded-2xl bg-card dark:bg-card border border-border hover:border-vulcan-accent-blue/50 dark:hover:border-vulcan-accent-blue/50 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-vulcan-accent-blue/10 dark:bg-vulcan-accent-blue/20 group-hover:bg-vulcan-accent-blue/20 dark:group-hover:bg-vulcan-accent-blue/30 transition-colors">
                  <Phone className="h-6 w-6 text-vulcan-accent-blue dark:text-vulcan-accent-blue" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground dark:text-foreground mb-2">Phone</h3>
                  <a 
                    href="tel:+916362014532" 
                    className="text-foreground/80 dark:text-foreground/70 hover:text-vulcan-accent-blue dark:hover:text-vulcan-accent-blue transition-colors"
                  >
                    +91 6362 014 532
                  </a>
                </div>
              </div>
            </div>

            {/* Working Hours */}
            <div className="group p-6 rounded-2xl bg-card dark:bg-card border border-border hover:border-vulcan-accent-blue/50 dark:hover:border-vulcan-accent-blue/50 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-vulcan-accent-blue/10 dark:bg-vulcan-accent-blue/20 group-hover:bg-vulcan-accent-blue/20 dark:group-hover:bg-vulcan-accent-blue/30 transition-colors">
                  <Clock className="h-6 w-6 text-vulcan-accent-blue dark:text-vulcan-accent-blue" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground dark:text-foreground mb-2">Working Hours</h3>
                  <div className="space-y-1 text-foreground/80 dark:text-foreground/70">
                    <p className="text-sm">Mon - Fri : 9AM - 6PM</p>
                    <p className="text-sm">Sat : 10AM - 4PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Support */}
            <div className="group p-6 rounded-2xl bg-card dark:bg-card border border-border hover:border-vulcan-accent-blue/50 dark:hover:border-vulcan-accent-blue/50 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-vulcan-accent-blue/10 dark:bg-vulcan-accent-blue/20 group-hover:bg-vulcan-accent-blue/20 dark:group-hover:bg-vulcan-accent-blue/30 transition-colors">
                  <Headphones className="h-6 w-6 text-vulcan-accent-blue dark:text-vulcan-accent-blue" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground dark:text-foreground mb-2">Customer Support</h3>
                  <p className="text-sm text-foreground/80 dark:text-foreground/70">
                    Our support team is available around the clock to address any concerns or queries you may have.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
