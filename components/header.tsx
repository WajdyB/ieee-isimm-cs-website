"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Executive Committee", href: "/committee" },
    { name: "Events", href: "/events" },
    { name: "Projects", href: "/projects" },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-orange-100 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* CS Logo - Links to Home */}
          <Link href="/" className="flex items-center">
            <Logo type="cs" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="nav-link group"
              >
                {item.name}
              </Link>
            ))}
            <Link href="/member/login">
              <Button variant="outline" size="sm" className="border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white">
                <Trophy className="h-4 w-4 mr-2" />
                Member Portal
              </Button>
            </Link>
          </nav>

          {/* IEEE ISIMM SB Logo - Links to Main SB Website */}
          <Link 
            href="https://isimm.ieee.tn/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden md:flex items-center"
          >
            <Logo type="ieeeIsimmSb" />
          </Link>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden hover:bg-orange-50" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6 text-orange-500" /> : <Menu className="h-6 w-6 text-orange-500" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-orange-100">
            <div className="flex flex-col space-y-3 pt-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-orange-500 font-medium transition-colors duration-200 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/member/login"
                className="flex items-center text-orange-600 hover:text-orange-700 font-semibold transition-colors duration-200 py-2 border-t border-orange-100 mt-2 pt-4"
                onClick={() => setIsMenuOpen(false)}
              >
                <Trophy className="h-4 w-4 mr-2" />
                Member Portal
              </Link>
            </div>
            <Link 
              href="https://isimm.ieee.tn/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex justify-center mt-4 pt-4 border-t border-orange-100"
            >
              <Logo type="ieeeIsimmSbMobile" />
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}

export default Header
