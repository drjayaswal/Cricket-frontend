import React, { useState } from "react";
// import { a } from "react-router-dom";
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

      <a href="/" className="text-blue-500 text-xl font-bold">
        Galaxy
      </a>

      <div className="hidden lg:flex items-center space-x-6 text-gray-300">
        <a href="/" className="hover:text-blue-500 transition-colors">
          Home
        </a>
        <a href="/live-matches" className="hover:text-blue-500 transition-colors">
          Live Matches
        </a>
        <a href="/mybets" className="hover:text-blue-500 transition-colors">
          MyBets
        </a>
        <a href="/wallet" className="hover:text-blue-500 transition-colors">
          Wallet
        </a>
        <a href="/contact" className="hover:text-blue-500 transition-colors">
          Contact
        </a>
        <a href="/about" className="hover:text-blue-500 transition-colors">
          About Us
        </a>
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
              <a
                href="/"
                className="block py-2 text-gray-300 hover:text-blue-500 transition-colors"
                onClick={toggleMenu}
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="/live-matches"
                className="block py-2 text-gray-300 hover:text-blue-500 transition-colors"
                onClick={toggleMenu}
              >
                Live Matches
              </a>
            </li>
            <li>
              <a
                href="/mybets"
                className="block py-2 text-gray-300 hover:text-blue-500 transition-colors"
                onClick={toggleMenu}
              >
                MyBets
              </a>
            </li>
            <li>
              <a
                href="/wallet"
                className="block py-2 text-gray-300 hover:text-blue-500 transition-colors"
                onClick={toggleMenu}
              >
                Wallet
              </a>
            </li>
            <li>
              <a
                href="/contact"
                className="block py-2 text-gray-300 hover:text-blue-500 transition-colors"
                onClick={toggleMenu}
              >
                Contact
              </a>
            </li>
            <li>
              <a
                href="/about"
                className="block py-2 text-gray-300 hover:text-blue-500 transition-colors"
                onClick={toggleMenu}
              >
                About Us
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </header>
  )
};

export default Navbar;
