import "@/styles/globals.css";

import type { ReactNode } from "react";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import AuthModal from "@/components/auth/AuthModal";

import ContextProvider from "@/context/ContextProvider";

export const metadata = {
  title: "RoyalChess - Premium Online Chess",
  description: "Experience chess like royalty. Play online with stunning visuals and smooth gameplay.",
  openGraph: {
    title: "RoyalChess - Premium Online Chess",
    description: "Experience chess like royalty. Play online with stunning visuals and smooth gameplay.",
    url: "https://ches.su",
    siteName: "RoyalChess",
    locale: "en_US",
    type: "website"
  },
  robots: {
    index: true,
    follow: false,
    nocache: true,
    noarchive: true
  },
  icons: {
    icon: [
      { type: "image/png", sizes: "32x32", url: "/favicon-32x32.png" },
      { type: "image/png", sizes: "16x16", url: "/favicon-16x16.png" }
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180" }
  },
  manifest: "/site.webmanifest",
  metadataBase: new URL(process.env.VERCEL ? "https://ches.su" : "http://localhost:3000")
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body className="overflow-x-hidden bg-gradient-to-br from-base-100 via-base-200 to-base-100">
        <ContextProvider>
          <div className="animate-fade-in">
            <Header />
          </div>

          <main className="mx-1 flex min-h-[70vh] justify-center md:mx-16 lg:mx-40 animate-slide-up">
            {children}
          </main>

          <AuthModal />
        </ContextProvider>

        <Footer />

        {/* next/script issue: https://github.com/vercel/next.js/issues/43402 */}
        <script
          id="load-theme"
          dangerouslySetInnerHTML={{
            __html: `if (localStorage.theme === "dark" || (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
              document.documentElement.setAttribute("data-theme", "royalchessDark");
          } else {
              document.documentElement.setAttribute("data-theme", "royalchessLight");
          }`
          }}
        ></script>
      </body>
    </html>
  );
}
