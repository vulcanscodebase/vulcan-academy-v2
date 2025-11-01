import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
export function Questions() {
  return (
    <section className="w-full py-20 md:py-32 lg:py-48 bg-background dark:bg-background">
      <div className="px-4 sm:px-6 md:px-12">
        {/* Main Heading */}
        <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-light tracking-tight text-foreground text-balance mb-12">
          Frequently Asked Questions
        </h2>

        <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger>What courses do you offer?</AccordionTrigger>
            <AccordionContent>
              We offer a variety of courses in web development, data science, and more.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>How can I enroll in a course?</AccordionTrigger>
            <AccordionContent>
              You can enroll in a course by visiting our website and filling out the registration form.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>Do you offer any certifications?</AccordionTrigger>
            <AccordionContent>
              Yes, we offer certifications for our courses upon completion.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>What is the refund policy?</AccordionTrigger>
            <AccordionContent>
              Our refund policy allows you to request a refund within 30 days of purchase.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  )
}