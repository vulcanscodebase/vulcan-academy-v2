import { TermsAndConditions } from "@/components/(policies)/terms-and-conditions";
import { Navbar } from "@/components/(layout-wrapper)/navbar";
import { Footer } from "@/components/(layout-wrapper)/footer";

export default function TermsAndConditionsPage(){
    return(
        <>
        <Navbar />
        <TermsAndConditions />
        <Footer />
        </>
    )
}