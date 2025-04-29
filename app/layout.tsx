import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Modern Blog Platform",
  description: "A feature-rich blogging platform built with Next.js and MongoDB",
  generator: "v0.dev",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yourblog.com",
    siteName: "Modern Blog Platform",
    title: "Modern Blog Platform",
    description: "A feature-rich blogging platform built with Next.js and MongoDB",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Modern Blog Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Modern Blog Platform",
    description: "A feature-rich blogging platform built with Next.js and MongoDB",
    images: ["/og-image.jpg"],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <div className="min-h-screen bg-background">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  )
}
