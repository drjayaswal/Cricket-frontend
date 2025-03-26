import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <header className="bg-black border-b border-gray-800 sticky top-0 z-50">
    <div className="flex items-center justify-between p-4">
      <button className="text-white lg:hidden" onClick={toggleMenu} aria-label="Toggle menu">
        <Menu size={24} />
      </button>

      <Link href="/" className="text-blue-500 text-xl font-bold">
        Galaxy
      </Link>

      <div className="hidden lg:flex items-center space-x-6 text-gray-300">
        <Link href="/" className="hover:text-blue-500 transition-colors">
          Home
        </Link>
        <a href="/live-matches" className="hover:text-blue-500 transition-colors">
          Live Matches
        </a>
        <Link href="/mybets" className="hover:text-blue-500 transition-colors">
          MyBets
        </Link>
        <Link href="/wallet" className="hover:text-blue-500 transition-colors">
          Wallet
        </Link>
        <Link href="/contact" className="hover:text-blue-500 transition-colors">
          Contact
        </Link>
        <Link href="/about" className="hover:text-blue-500 transition-colors">
          About Us
        </Link>
      </div>

      <div className="w-10 h-10 rounded-full overflow-hidden">
        <img
          src="/placeholder.svg?height=40&width=40"
          alt="Profile"
          width={40}
          height={40}
          className="object-cover"
        />
      </div>
    </div>

    {/* Mobile Menu Slide-in */}
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden transition-opacity duration-300 ${
        isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={toggleMenu}
    >
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <span className="text-blue-500 text-xl font-bold">Galaxy</span>
          <button onClick={toggleMenu} className="text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="p-4">
          <ul className="space-y-4">
            <li>
              <Link
                href="/"
                className="block py-2 text-gray-300 hover:text-blue-500 transition-colors"
                onClick={toggleMenu}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/live-matches"
                className="block py-2 text-gray-300 hover:text-blue-500 transition-colors"
                onClick={toggleMenu}
              >
                Live Matches
              </Link>
            </li>
            <li>
              <Link
                href="/mybets"
                className="block py-2 text-gray-300 hover:text-blue-500 transition-colors"
                onClick={toggleMenu}
              >
                MyBets
              </Link>
            </li>
            <li>
              <Link
                href="/wallet"
                className="block py-2 text-gray-300 hover:text-blue-500 transition-colors"
                onClick={toggleMenu}
              >
                Wallet
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="block py-2 text-gray-300 hover:text-blue-500 transition-colors"
                onClick={toggleMenu}
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="block py-2 text-gray-300 hover:text-blue-500 transition-colors"
                onClick={toggleMenu}
              >
                About Us
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </header>
  )
};

export default Navbar;
