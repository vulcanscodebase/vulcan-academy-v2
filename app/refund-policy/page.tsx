import { RefundPolicy } from "@/components/(policies)/refund-policy";
import { Navbar } from "@/components/(layout-wrapper)/navbar";
import { Footer } from "@/components/(layout-wrapper)/footer";



export default function RefundPolicyPage(){
    return(
    <>
    <Navbar />
    <RefundPolicy />
    <Footer />
    </>
    )
}