"use client";

import Link from "next/link";
import { PWAInstallButton } from "./PWAInstallButton";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
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
              <span className="font-bold text-xl">PhysioMaint</span>
            </div>
            <p className="text-gray-400 text-sm">
              Comprehensive learning companion for physiotherapy equipment maintenance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/short-wave-diathermy" className="hover:text-white transition-colors">
                  Short Wave Diathermy
                </Link>
              </li>
              <li>
                <Link href="/muscle-stimulator" className="hover:text-white transition-colors">
                  Muscle Stimulator
                </Link>
              </li>
              <li>
                <Link href="/infrared-therapy" className="hover:text-white transition-colors">
                  Infrared Therapy
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  All Equipment →
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Install */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Install App</h3>
            <div className="mb-4">
              <PWAInstallButton />
            </div>
            <div className="border-t border-gray-700 pt-4 mt-4">
              <p className="text-sm text-gray-400 mb-1">Developed by</p>
              <p className="font-semibold text-white">Kevin Koech</p>
              <a
                href="mailto:kevkokip@gmail.com"
                className="text-teal-400 hover:text-teal-300 text-sm transition-colors"
              >
                kevkokip@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} PhysioMaint. All rights reserved.</p>
          <p className="mt-1">
            Developed with ❤️ by{" "}
            <a href="mailto:kevkokip@gmail.com" className="text-teal-400 hover:text-teal-300">
              Kevin Koech
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
