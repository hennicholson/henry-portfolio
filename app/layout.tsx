import type { Metadata } from "next";
import { Geist, Geist_Mono, Caveat } from "next/font/google";
import "./globals.css";
import { VoiceProvider } from "@/components/voice/voice-provider";
import { VoiceBubble } from "@/components/voice/voice-bubble";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://henrynicholson.dev"),
  title: {
    default: "Henry Nicholson — Builder & Entrepreneur",
    template: "%s | Henry Nicholson",
  },
  description:
    "Portfolio of Henry Nicholson. Building things on the internet since age 13. AI, SaaS, creative production.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Henry Nicholson — Builder & Entrepreneur",
    description:
      "Building things on the internet since age 13. AI, SaaS, creative production.",
    url: "https://henrynicholson.dev",
    siteName: "Henry Nicholson",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Henry Nicholson — Builder & Entrepreneur",
    description:
      "Building things on the internet since age 13. AI, SaaS, creative production.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Henry Nicholson",
  url: "https://henrynicholson.dev",
  description:
    "Builder and entrepreneur working across AI, SaaS, and creative production.",
  sameAs: [
    "https://x.com/henryfromskinny",
    "https://www.linkedin.com/in/henrymnicholson/",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} antialiased bg-[#050508] text-white`}
      >
        <VoiceProvider>
          {children}
          <VoiceBubble />
        </VoiceProvider>
      </body>
    </html>
  );
}
