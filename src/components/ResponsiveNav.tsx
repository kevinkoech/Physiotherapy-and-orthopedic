"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { PWAInstallButton } from "./PWAInstallButton";
import { useAuth } from "@/context/AuthContext";

interface NavItem {
  name: string;
  href: string;
  color: string;
}

const navItems: NavItem[] = [
  { name: "Short Wave Diathermy", href: "/short-wave-diathermy", color: "bg-blue-500" },
  { name: "Muscle Stimulator", href: "/muscle-stimulator", color: "bg-green-500" },
  { name: "Infrared Therapy", href: "/infrared-therapy", color: "bg-orange-500" },
  { name: "Ultrasound Therapy", href: "/ultrasound-therapy", color: "bg-sky-500" },
  { name: "Electrotherapy", href: "/electrotherapy", color: "bg-violet-500" },
  { name: "Hydro-Collator", href: "/hydro-collator", color: "bg-cyan-500" },
  { name: "Massage Therapy", href: "/massage-therapy", color: "bg-purple-500" },
  { name: "Orthopaedic Oscillator", href: "/orthopaedic-oscillator", color: "bg-pink-500" },
  { name: "Hot Air Oven", href: "/hot-air-oven", color: "bg-amber-500" },
  { name: "Traction Therapy", href: "/traction-therapy", color: "bg-indigo-500" },
  { name: "Electrosurgical Unit", href: "/electrosurgical-unit", color: "bg-red-500" },
  { name: "Microwave Diathermy", href: "/microwave-diathermy", color: "bg-teal-500" },
  { name: "Orthopaedic Saw", href: "/orthopaedic-saw", color: "bg-gray-500" },
  { name: "Implants", href: "/implants", color: "bg-emerald-500" },
  { name: "Orthotics & Prosthesis", href: "/orthotics-prosthesis", color: "bg-rose-500" },
  { name: "Rehabilitative Engineering", href: "/rehabilitative-engineering", color: "bg-lime-500" },
  { name: "Tissue Engineering", href: "/tissue-engineering", color: "bg-emerald-600" },
];

export function ResponsiveNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const prevPathnameRef = useRef(pathname);

  // Filter nav items based on search query
  const filteredNavItems = navItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;
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

          {/* Right side buttons */}
          <div className="flex items-center gap-2">
            {/* PWA Install Button */}
            <PWAInstallButton />

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
                  {user && (
                    <>
                      <Link
                        href="/report-history"
                        onClick={closeMenu}
                        className="block px-4 py-2 hover:bg-gray-50 text-gray-700 font-medium"
                      >
                        📊 My Reports
                      </Link>
                      {(user.role === "admin" || user.role === "trainer") && (
                        <Link
                          href="/admin"
                          onClick={closeMenu}
                          className="block px-4 py-2 hover:bg-gray-50 text-gray-700 font-medium"
                        >
                          🔐 Admin Dashboard
                        </Link>
                      )}
                    </>
                  )}
                  <div className="border-t my-2" />
                  {!user ? (
                    <Link
                      href="/login"
                      onClick={closeMenu}
                      className="block px-4 py-2 hover:bg-gray-50 text-blue-600 font-medium"
                    >
                      🔑 Sign In
                    </Link>
                  ) : (
                    <button
                      onClick={() => {
                        logout();
                        router.push("/");
                        closeMenu();
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600 font-medium"
                    >
                      🚪 Sign Out ({user.name})
                    </button>
                  )}
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

        {/* Search Bar - Mobile */}
        <div className="md:hidden pb-3">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search equipment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          
          {/* Search Results - Mobile */}
          {searchQuery && (
            <div className="mt-2 bg-white rounded-lg shadow-lg border border-gray-100 max-h-60 overflow-y-auto">
              {filteredNavItems.length > 0 ? (
                filteredNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => {
                      closeMenu();
                      setSearchQuery("");
                    }}
                    className={`flex items-center gap-2 px-4 py-3 border-b last:border-b-0 ${
                      pathname === item.href ? "bg-teal-50 text-teal-700" : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    {item.name}
                  </Link>
                ))
              ) : (
                <div className="px-4 py-3 text-gray-500 text-center">No equipment found</div>
              )}
            </div>
          )}
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
            {user && (
              <>
                <Link
                  href="/report-history"
                  onClick={closeMenu}
                  className="block px-4 py-3 hover:bg-gray-50 text-gray-700 font-medium border-b"
                >
                  📊 My Reports
                </Link>
                {(user.role === "admin" || user.role === "trainer") && (
                  <Link
                    href="/admin"
                    onClick={closeMenu}
                    className="block px-4 py-3 hover:bg-gray-50 text-gray-700 font-medium border-b"
                  >
                    🔐 Admin Dashboard
                  </Link>
                )}
              </>
            )}
            {!user ? (
              <Link
                href="/login"
                onClick={closeMenu}
                className="block px-4 py-3 hover:bg-gray-50 text-blue-600 font-medium border-b"
              >
                🔑 Sign In
              </Link>
            ) : (
              <button
                onClick={() => {
                  logout();
                  router.push("/");
                  closeMenu();
                }}
                className="block w-full text-left px-4 py-3 hover:bg-gray-50 text-red-600 font-medium border-b"
              >
                🚪 Sign Out ({user.name})
              </button>
            )}
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
