import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { projects } from "./schema";
import { sql } from "drizzle-orm";

const seedProjects = [
  {
    slug: "launchpad",
    title: "LaunchPad",
    subtitle: "Landing Funnel Builder for Whop",
    description:
      "A SaaS platform that lets Whop creators build high-converting landing funnels in minutes. Features an AI voice agent that qualifies leads and handles objections.",
    url: "https://onwhop.com",
    tags: ["SaaS", "Whop", "AI", "React"],
    year: "2026",
    iframeable: true,
    span: 2,
    accent:
      "radial-gradient(ellipse at 90% 10%, rgba(255,255,255,0.04) 0%, transparent 60%)",
    number: "01",
    thumbnail: "/thumbnails/launchpad.webp",
    sortOrder: 0,
  },
  {
    slug: "forefront-usd",
    title: "ForeFront USD",
    subtitle: "Student AI Education Network",
    description:
      "Co-founded the first student-led AI education initiative at the University of South Dakota. 100+ active users within its first six weeks.",
    url: "https://beforefront.com",
    tags: ["EdTech", "AI", "Community"],
    year: "2025",
    iframeable: true,
    span: 1,
    accent:
      "radial-gradient(ellipse at 10% 90%, rgba(255,255,255,0.04) 0%, transparent 60%)",
    number: "02",
    thumbnail: "/thumbnails/forefront.webp",
    sortOrder: 1,
  },
  {
    slug: "skinny-studio",
    title: "Skinny Studio",
    subtitle: "AI Creative Platform on Whop",
    description:
      "An AI-powered creative platform merging technical skill with an advertising eye. Packages creative production tools and workflows into a single membership.",
    url: "https://skinny.studio",
    tags: ["AI", "Creative", "Whop"],
    year: "2025",
    iframeable: true,
    span: 1,
    accent:
      "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.03) 0%, transparent 50%)",
    number: "03",
    thumbnail: "/thumbnails/skinny-studio.webp",
    sortOrder: 2,
  },
  {
    slug: "slop-design",
    title: "Slop.design",
    subtitle: "Intentional AI Artifact Aesthetics",
    description:
      "A brand identity project that embraces the raw, imperfect artifacts of AI-generated imagery as a deliberate design language.",
    url: "#",
    tags: ["Design", "Brand", "AI"],
    year: "2025",
    iframeable: false,
    span: 2,
    accent:
      "radial-gradient(ellipse at 90% 90%, rgba(255,255,255,0.04) 0%, transparent 60%)",
    number: "04",
    thumbnail: "/thumbnails/slop-design.webp",
    sortOrder: 3,
  },
  {
    slug: "adventures-in-ai",
    title: "Adventures in AI",
    subtitle: "Weekly Agency Newsletter",
    description:
      "A weekly newsletter authored at Global Prairie, now 53+ issues deep. Distilling the latest AI tools, techniques, and strategic implications.",
    url: "#",
    tags: ["Newsletter", "AI", "Marketing"],
    year: "2025",
    iframeable: false,
    span: 2,
    accent:
      "radial-gradient(ellipse at 10% 10%, rgba(255,255,255,0.04) 0%, transparent 60%)",
    number: "05",
    thumbnail: "/thumbnails/adventures-ai.webp",
    sortOrder: 4,
  },
  {
    slug: "ai-video-production",
    title: "AI Video Production",
    subtitle: "Multi-Tool Production Pipelines",
    description:
      "End-to-end AI video production pipelines built for commercial projects and major brands. Broadcast-quality content at a fraction of the traditional timeline.",
    url: "#",
    tags: ["Video", "AI", "Production"],
    year: "2025",
    iframeable: false,
    span: 1,
    accent:
      "radial-gradient(ellipse at 50% 100%, rgba(255,255,255,0.03) 0%, transparent 50%)",
    number: "06",
    thumbnail: "/thumbnails/ai-video.webp",
    sortOrder: 5,
  },
];

async function seed() {
  const client = neon(process.env.DATABASE_URL!);
  const db = drizzle(client);

  console.log("Seeding projects...");

  for (const project of seedProjects) {
    await db
      .insert(projects)
      .values(project)
      .onConflictDoUpdate({
        target: projects.slug,
        set: {
          title: sql`excluded.title`,
          subtitle: sql`excluded.subtitle`,
          description: sql`excluded.description`,
          url: sql`excluded.url`,
          tags: sql`excluded.tags`,
          year: sql`excluded.year`,
          iframeable: sql`excluded.iframeable`,
          span: sql`excluded.span`,
          accent: sql`excluded.accent`,
          number: sql`excluded.number`,
          thumbnail: sql`excluded.thumbnail`,
          sortOrder: sql`excluded.sort_order`,
          updatedAt: sql`now()`,
        },
      });
    console.log(`  ✓ ${project.slug}`);
  }

  console.log("Done!");
}

seed().catch(console.error);
