import type { Metadata, Viewport } from "next";
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
    "Henry Nicholson — AI-forward Creative Developer & Designer. Junior Associate at Global Prairie; creator of Skinny Studio, vibechckd, LaunchPad, and ForeFront.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Henry Nicholson — Builder & Entrepreneur",
    description:
      "AI-forward Creative Developer & Designer. Junior Associate at Global Prairie; creator of Skinny Studio, vibechckd, LaunchPad, and ForeFront.",
    url: "https://henrynicholson.dev",
    siteName: "Henry Nicholson",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Henry Nicholson — Builder & Entrepreneur",
    description:
      "AI-forward Creative Developer & Designer. Junior Associate at Global Prairie; creator of Skinny Studio, vibechckd, LaunchPad, and ForeFront.",
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

export const viewport: Viewport = {
  themeColor: "#050508",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  dateCreated: "2026-04-02",
  dateModified: "2026-07-02",
  mainEntity: {
    "@type": "Person",
    name: "Henry Nicholson",
    identifier: "henrymnicholson",
    url: "https://henrynicholson.dev",
    image: "https://henrynicholson.dev/opengraph-image",
    jobTitle: "Creative Developer & Designer",
    description:
      "AI-forward creative developer and designer based in San Diego. Junior Associate at Global Prairie, and independent creator of Skinny Studio, vibechckd, LaunchPad, Sevas.xyz, and ForeFront. Self-taught since age 13; co-founded STEEZ and Out Of Style.",
    worksFor: {
      "@type": "Organization",
      name: "Global Prairie",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "University of San Diego",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "San Diego",
      addressRegion: "CA",
    },
    knowsAbout: [
      "Software Development",
      "Artificial Intelligence",
      "Whop App Development",
      "Creative AI Tooling",
      "SaaS Product Development",
      "Brand Development",
      "Digital Product Design",
    ],
    sameAs: [
      "https://x.com/henryfromskinny",
      "https://www.linkedin.com/in/henrymnicholson/",
    ],
  },
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
