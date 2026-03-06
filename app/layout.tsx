import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "REIKS — Forged by Intelligence",
  description: "India's first AI-native gold jewelry platform. Design with AI, lock prices in real-time, buy with confidence.",
  keywords: ["gold jewelry", "AI jewelry design", "gold price lock", "luxury jewelry", "REIKS", "Chennai"],
  openGraph: {
    title: "REIKS — Forged by Intelligence",
    description: "India's first AI-native gold jewelry platform. Design with AI, lock gold prices live.",
    siteName: "REIKS",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#080808" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="bg-reiks-black text-reiks-white font-body antialiased min-h-screen">
        <div className="flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}
