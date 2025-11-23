import { Navbar } from "@/components/(layout-wrapper)/navbar";
import { ShippingPolicy } from "@/components/(policies)/shipping-policy";
import { Footer } from "@/components/(layout-wrapper)/footer";

export default function ShippingPolicyPage(){
    return(
        <>
        <Navbar />
        <ShippingPolicy />
        <Footer />
        </>
    )
}