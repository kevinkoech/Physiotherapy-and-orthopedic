"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  name: string;
  href: string;
  color: string;
}

const navItems: NavItem[] = [
  { name: "Short Wave Diathermy", href: "/short-wave-diathermy", color: "bg-blue-500" },
  { name: "Muscle Stimulator", href: "/muscle-stimulator", color: "bg-green-500" },
  { name: "Infrared Therapy", href: "/infrared-therapy", color: "bg-orange-500" },
  { name: "Hydro-Collator", href: "/hydro-collator", color: "bg-cyan-500" },
  { name: "Massage Therapy", href: "/massage-therapy", color: "bg-purple-500" },
  { name: "Orthopaedic Oscillator", href: "/orthopaedic-oscillator", color: "bg-pink-500" },
  { name: "Hot Air Oven", href: "/hot-air-oven", color: "bg-amber-500" },
  { name: "Traction Therapy", href: "/traction-therapy", color: "bg-indigo-500" },
  { name: "Electrosurgical Unit", href: "/electrosurgical-unit", color: "bg-red-500" },
  { name: "Microwave Diathermy", href: "/microwave-diathermy", color: "bg-teal-500" },
  { name: "Orthopaedic Saw", href: "/orthopaedic-saw", color: "bg-gray-500" },
  { name: "Implants", href: "/implants", color: "bg-emerald-500" },
];

export function ResponsiveNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const prevPathnameRef = useRef(pathname);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when route changes - use ref to avoid setState in effect
  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;
      // Use a microtask to defer the state update
      const timer = setTimeout(() => setIsOpen(false), 0);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-lg" : "bg-white/95"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2" onClick={closeMenu}>
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                />
              </svg>
            </div>
            <span className="font-bold text-lg text-gray-800 hidden sm:inline">PhysioMaint</span>
          </Link>

          {/* Install App Button */}
          <button
            onClick={() => alert('Install app functionality would go here')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="font-medium text-gray-700 hidden sm:inline">Install App</span>
          </button>

          {/* Search Button */}
          <button
            onClick={() => alert('Search functionality would go here')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="font-medium text-gray-700 hidden sm:inline">Search</span>
          </button>

          {/* Desktop Navigation - Dropdown */}
          <div className="hidden md:block relative">
            <button
              onClick={toggleMenu}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <span className="font-medium text-gray-700">
                {pathname === "/" ? "Select Equipment" : navItems.find((item) => item.href === pathname)?.name || "Select Equipment"}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 py-2 max-h-[70vh] overflow-y-auto">
                <Link
                  href="/"
                  onClick={closeMenu}
                  className="block px-4 py-2 hover:bg-gray-50 text-gray-700 font-medium"
                >
                  🏠 Home
                </Link>
                <div className="border-t my-2" />
                <div className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase">Equipment Modules</div>
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className={`flex items-center gap-2 px-4 py-2 hover:bg-gray-50 ${
                      pathname === item.href ? "bg-teal-50 text-teal-700" : "text-gray-700"
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${item.color}`} />
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <div className="max-h-[70vh] overflow-y-auto">
            <Link
              href="/"
              onClick={closeMenu}
              className="block px-4 py-3 hover:bg-gray-50 text-gray-700 font-medium border-b"
            >
              🏠 Home
            </Link>
            <button
              onClick={() => { alert('Install app functionality would go here'); closeMenu(); }}
              className="block w-full text-left px-4 py-3 hover:bg-gray-50 text-gray-700 font-medium border-b flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Install App
            </button>
            <button
              onClick={() => { alert('Search functionality would go here'); closeMenu(); }}
              className="block w-full text-left px-4 py-3 hover:bg-gray-50 text-gray-700 font-medium border-b flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </button>
            <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase bg-gray-50">Equipment Modules</div>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className={`flex items-center gap-2 px-4 py-3 border-b ${
                  pathname === item.href ? "bg-teal-50 text-teal-700" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${item.color}`} />
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
