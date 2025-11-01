import { GetInTouch } from "@/components/(contact-us)/get-in-touch";
// import { Location } from "@/components/(contact-us)/location";
import { Navbar } from "@/components/(layout-wrapper)/navbar";
import { Footer } from "@/components/(layout-wrapper)/footer";
import { BeforeFooterContact } from "@/components/(contact-us)/before-footers";

export default function Contact() {
  return (
    <>
      <Navbar />
      <GetInTouch />
      {/* <Location /> */}
      <BeforeFooterContact />
      <Footer />
    </>
  );
}
