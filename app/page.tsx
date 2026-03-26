import { ParallaxHero } from "@/components/parallax-hero";
import { SkillsMarquee } from "@/components/skills-marquee";
import { IntroText } from "@/components/intro-text";
import { ScrollTimeline } from "@/components/scroll-timeline";
import { Toolbox } from "@/components/toolbox";
import { ProjectGallery } from "@/components/project-gallery";
import SlackTestimonials from "@/components/slack-testimonials";
import { NewsletterCTA } from "@/components/newsletter-cta";
import { ScrollProgress } from "@/components/scroll-progress";
import { SectionTransition } from "@/components/section-transition";
import { ConnectSection } from "@/components/connect-section";
import { CommandPalette } from "@/components/command-palette";
import { EasterEggs } from "@/components/easter-eggs";
import { VoiceCTA } from "@/components/voice/voice-cta";
import { getVisibleProjects, getVisibleToolCategories, getVisibleTestimonials } from "@/lib/db/queries";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [projects, toolCategories, dbTestimonials] = await Promise.all([
    getVisibleProjects(),
    getVisibleToolCategories(),
    getVisibleTestimonials(),
  ]);

  return (
    <main className="bg-[#050508]">
<ScrollProgress />
      <CommandPalette />
      <EasterEggs />

      <ParallaxHero />

      <VoiceCTA />

      <SkillsMarquee />

      <IntroText />

      <SectionTransition variant="chapter" />

      <ScrollTimeline />

      <Toolbox categories={toolCategories.length > 0 ? toolCategories : undefined} />

      <SectionTransition variant="chapter" />

      <ProjectGallery projects={projects.length > 0 ? projects : undefined} />

      <SlackTestimonials testimonials={dbTestimonials.length > 0 ? dbTestimonials.map((t) => ({
        id: t.id,
        name: t.name,
        text: t.text,
        avatarUrl: t.avatarUrl,
        workplace: t.workplace,
        color: t.color,
      })) : undefined} />

      <NewsletterCTA />

      <SectionTransition variant="subtle" />

      <ConnectSection />
    </main>
  );
}
