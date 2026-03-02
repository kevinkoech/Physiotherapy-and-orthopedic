import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
import { ResponsiveNav } from "@/components/ResponsiveNav";
import { Footer } from "@/components/Footer";
import { OnboardingScreen } from "@/components/OnboardingScreen";
import { SplashScreen } from "@/components/SplashScreen";
import { FloatingInstallButton } from "@/components/PWAInstallButton";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PhysioMaint - Physiotherapy Equipment Maintenance Learning",
  description: "Comprehensive learning notes for physiotherapy equipment maintenance including SWD, muscle stimulators, infrared therapy, and more. Interactive simulations and PDF export.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PhysioMaint",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0f766e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="PhysioMaint" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <NotificationProvider>
            <ServiceWorkerRegistration />
            <SplashScreen />
            <OnboardingScreen />
            <FloatingInstallButton />
            
            {/* Responsive Navigation */}
            <ResponsiveNav />

            {/* Main Content */}
            <main className="flex-1 max-w-7xl mx-auto px-4 py-6 w-full">
              {children}
            </main>

            {/* Footer with Credits */}
            <Footer />
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
