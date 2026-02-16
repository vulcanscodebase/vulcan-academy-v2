import Link from "next/link";
import Image from "next/image";
import { Linkedin, Instagram } from "lucide-react";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Vulcan Prep 360", path: "/vulcans-interview-master" },
  // { name: "Tests", path: "/tests" },
  // { name: "Courses", path: "/courses" },
  { name: "About Us", path: "/about" },
  { name: "Contact Us", path: "/contact" },
];

const policyLinks = [
  { name: "Terms and Conditions", path: "/terms-and-conditions" },
  { name: "Privacy Policy", path: "/privacy-policy" },
  // { name: "Shipping Policy", path: "/shipping-policy" },
  { name: "Payment and Refund Policy", path: "/refund-policy" },
];

const socials = [
  { Icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/company/vulcansin/" },
  {
    Icon: Instagram,
    label: "Instagram",
    href: "https://www.instagram.com/vulcan.prep?igsh=MW9jbmcwems5anlo",
  },
];

export function Footer() {
  return (
    <footer className="w-full bg-vulcan-dark-blue text-vulcan-white">
      {/* Top Grid Section */}
      <div className="px-8 sm:px-6 lg:px-16 py-16 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
        {/* Logo + About */}
        <div className="flex flex-col items-center md:items-start gap-4">
          <Image
            src="/vulcans-logo.png"
            alt="Vulcan Logo"
            width={100}
            height={100}
          />
          <p className="text-sm sm:text-base md:text-base text-gray-300 max-w-xs leading-relaxed">
            Vulcan Academy empowers students with cutting-edge knowledge and
            skills, transforming ambition into achievement.
          </p>
        </div>

        {/* Pages + Legal */}
        <div className="grid grid-cols-2 gap-8 justify-center">
          <div>
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-vulcan-bright-cyan mb-4">
              Pages
            </h3>
            <ul className="space-y-2 text-sm sm:text-base text-gray-300">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    className="hover:text-vulcan-bright-cyan transition-colors duration-300"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-vulcan-bright-cyan mb-4">
              Legal
            </h3>
            <ul className="space-y-2 text-sm sm:text-base text-gray-300">
              {policyLinks.map((policy) => (
                <li key={policy.name}>
                  <Link
                    href={policy.path}
                    className="hover:text-vulcan-bright-cyan transition-colors duration-300"
                  >
                    {policy.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Customer Care */}
        <div className="flex flex-col items-center md:items-start gap-3 text-sm sm:text-base text-gray-300">
          <h3 className="text-base sm:text-lg md:text-xl font-semibold text-vulcan-bright-cyan mb-2">
            Customer Care
          </h3>
          <p>+91 6362 014 532</p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-vulcan-soft-beige/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-16 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs sm:text-sm md:text-base text-gray-400">
            © {new Date().getFullYear()} Vulcan. All rights reserved.
          </p>

          <div className="flex space-x-4 md:space-x-6">
            {socials.map(({ Icon, label, href }) => (
              <Link
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex items-center justify-center text-gray-300 border border-gray-600 hover:border-vulcan-white rounded-md p-2 transition-all duration-300"
              >
                <Icon className="h-5 w-5 sm:h-6 sm:w-6 md:h-6 md:w-6" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
