import { PrivacyPolicy } from "@/components/(policies)/privacy-policy";
import { Navbar } from "@/components/(layout-wrapper)/navbar";
import { Footer } from "@/components/(layout-wrapper)/footer";

export default function PrivacyPolicyPage(){
    return(
        <>
        <Navbar />
        <PrivacyPolicy />
        <Footer />
        </>
    )
}