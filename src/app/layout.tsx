import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Physiotherapy Equipment Maintenance - Learning Notes",
  description: "Comprehensive learning notes for physiotherapy equipment maintenance including SWD, muscle stimulators, infrared therapy, and more.",
};

const navItems = [
  { href: "/", label: "Home" },
  { href: "/short-wave-diathermy", label: "SWD Machine" },
  { href: "/muscle-stimulator", label: "Muscle Stimulator" },
  { href: "/infrared-therapy", label: "Infrared Therapy" },
  { href: "/hydro-collator", label: "Hydro-Collator" },
  { href: "/massage-therapy", label: "Massage Therapy" },
  { href: "/orthopaedic-oscillator", label: "Orthopaedic Oscillator" },
  { href: "/hot-air-oven", label: "Hot Air Oven" },
  { href: "/traction-therapy", label: "Traction Therapy" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 min-h-screen`}
      >
        {/* Top Navigation Bar */}
        <nav className="bg-blue-900 text-white shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-14">
              <Link href="/" className="font-bold text-lg text-yellow-300 hover:text-yellow-100 transition-colors">
                🏥 PhysioTech Maintenance
              </Link>
              <div className="hidden lg:flex items-center gap-1 text-xs">
                {navItems.slice(1).map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="px-2 py-1 rounded hover:bg-blue-700 transition-colors whitespace-nowrap"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          {/* Mobile scroll nav */}
          <div className="lg:hidden overflow-x-auto flex gap-2 px-4 pb-2 text-xs">
            {navItems.slice(1).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-2 py-1 rounded bg-blue-800 hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-blue-900 text-white text-center py-4 mt-8 text-sm">
          <p>Physiotherapy Equipment Maintenance — Detailed Learning Notes</p>
          <p className="text-blue-300 text-xs mt-1">For educational purposes only</p>
        </footer>
      </body>
    </html>
  );
}
