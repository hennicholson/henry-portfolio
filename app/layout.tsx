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
  title: "Henry Nicholson — Builder & Entrepreneur",
  description:
    "Portfolio of Henry Nicholson. Building things on the internet since age 13.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
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
