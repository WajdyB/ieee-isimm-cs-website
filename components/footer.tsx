import Link from "next/link"
import { Facebook, Instagram, Linkedin, Mail } from "lucide-react"
import { Logo } from "@/components/ui/logo"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    {
      name: "Facebook",
      href: "https://www.facebook.com/ieee.cs.isimm",
      icon: Facebook,
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/ieee.cs.isimm/?hl=fr",
      icon: Instagram,
    },
    {
      name: "Email",
      href: "mailto:contact@cs-isimm.org",
      icon: Mail,
    },
  ]

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Executive Committee", href: "/committee" },
    { name: "Events", href: "/events" },
  ]

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <Logo type="cs" className="h-12 w-auto" />
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              IEEE Computer Society ISIMM Student Branch. Empowering students in computer science and engineering 
              through professional development, networking, and technical excellence opportunities.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full transition-colors duration-200"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-orange-400">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-orange-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-orange-400">Contact</h3>
            <div className="space-y-2 text-gray-300">
              <p>IEEE ISIMM Student Branch</p>
              <p>Monastir, Tunisia</p>
              <p>
                <Link
                  href="mailto:contact@cs-isimm.org"
                  className="hover:text-orange-400 transition-colors duration-200"
                >
                  contact@cs-isimm.org
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} IEEE CS ISIMM. All rights reserved.
            </p>
            <div className="flex items-center mt-4 md:mt-0">
              <span className="text-gray-400 text-sm mr-2">Powered by</span>
              <div className="flex items-center">
                <Logo type="ieee" className="h-6 w-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer 