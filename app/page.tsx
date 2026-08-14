import { ParallaxHero } from "@/components/parallax-hero";
import { SkillsMarquee } from "@/components/skills-marquee";
import { IntroText } from "@/components/intro-text";
import { ScrollTimeline } from "@/components/scroll-timeline";
import { Toolbox } from "@/components/toolbox";
import { ProjectStage } from "@/components/project-stage";
import { fallbackProjects } from "@/components/project-gallery";
import SlackTestimonials from "@/components/slack-testimonials";
import { NewsletterCTA } from "@/components/newsletter-cta";
import { ScrollProgress } from "@/components/scroll-progress";
import { SectionTransition } from "@/components/section-transition";
import { ConnectSection } from "@/components/connect-section";
import { CommandPalette } from "@/components/command-palette";
import { EasterEggs } from "@/components/easter-eggs";
import { VoiceCTA } from "@/components/voice/voice-cta";
import { SoundToggle } from "@/components/sound-toggle";
import { GuidesSection } from "@/components/guides-section";
import { getVisibleProjects, getVisibleToolCategories, getVisibleTestimonials, getVisibleGuides } from "@/lib/db/queries";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [projects, toolCategories, dbTestimonials, dbGuides] = await Promise.all([
    getVisibleProjects(),
    getVisibleToolCategories(),
    getVisibleTestimonials(),
    getVisibleGuides(),
  ]);

  return (
    <main className="bg-[#050508]">
<ScrollProgress />
      <CommandPalette />
      <EasterEggs />
      <SoundToggle />

      <ParallaxHero />

      <VoiceCTA />

      <SkillsMarquee />

      <IntroText />

      <SectionTransition variant="chapter" />

      <ScrollTimeline />

      <Toolbox categories={toolCategories.length > 0 ? toolCategories : undefined} />

      <SectionTransition variant="chapter" />

      <ProjectStage projects={projects.length > 0 ? projects : fallbackProjects} />

      <SlackTestimonials testimonials={dbTestimonials.length > 0 ? dbTestimonials.map((t) => ({
        id: t.id,
        name: t.name,
        text: t.text,
        avatarUrl: t.avatarUrl,
        workplace: t.workplace,
        color: t.color,
      })) : undefined} />

      <NewsletterCTA />

      <SectionTransition variant="chapter" />

      <GuidesSection dbGuides={dbGuides.length > 0 ? dbGuides.map((g) => ({
        id: g.slug,
        title: g.title,
        subtitle: g.subtitle,
        summary: g.summary,
        chapters: g.chapters,
        pages: g.pages,
        date: g.date,
        accent: g.accent,
        pdf: g.pdfUrl,
        topics: g.topics,
        toc: g.toc.length > 0 ? g.toc : undefined,
        takeaways: g.takeaways.length > 0 ? g.takeaways : undefined,
      })) : undefined} />

      <SectionTransition variant="subtle" />

      <ConnectSection />
    </main>
  );
}
