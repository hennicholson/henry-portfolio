import { ParallaxHero } from "@/components/parallax-hero";
import { IntroText } from "@/components/intro-text";
import { ScrollTimeline } from "@/components/scroll-timeline";

export default function Home() {
  return (
    <main className="bg-black">
      <ParallaxHero />

      <IntroText />

      <ScrollTimeline />

      {/* Footer */}
      <footer className="py-20 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-white/30 text-sm">
            &copy; {new Date().getFullYear()} Henry Nicholson
          </p>
        </div>
      </footer>
    </main>
  );
}
