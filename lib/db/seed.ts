import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { projects, toolCategories, tools } from "./schema";
import { sql, eq } from "drizzle-orm";

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

const seedToolCategories = [
  {
    label: "Build",
    sortOrder: 0,
    tools: [
      { name: "React", note: "UI", logoUrl: "/logos/react.svg", sortOrder: 0 },
      { name: "Next.js", note: "Framework", logoUrl: "/logos/nextjs.svg", sortOrder: 1 },
      { name: "TypeScript", note: "Language", logoUrl: "/logos/typescript.svg", sortOrder: 2 },
      { name: "Node.js", note: "Runtime", logoUrl: "/logos/nodejs.svg", sortOrder: 3 },
      { name: "Tailwind", note: "Styling", logoUrl: "/logos/tailwind.svg", sortOrder: 4 },
      { name: "GSAP", note: "Animation", logoUrl: "/logos/gsap.svg", sortOrder: 5 },
    ],
  },
  {
    label: "AI",
    sortOrder: 1,
    tools: [
      { name: "Claude", note: "Reasoning", logoUrl: "/logos/claude.svg", sortOrder: 0 },
      { name: "GPT", note: "Generation", logoUrl: "/logos/gpt.svg", sortOrder: 1 },
      { name: "Midjourney", note: "Imagery", logoUrl: "/logos/midjourney.svg", sortOrder: 2 },
      { name: "Runway", note: "Video", logoUrl: "/logos/runway.svg", sortOrder: 3 },
      { name: "ElevenLabs", note: "Voice", logoUrl: "/logos/elevenlabs.svg", sortOrder: 4 },
      { name: "Cursor", note: "Code", logoUrl: "/logos/cursor.svg", sortOrder: 5 },
    ],
  },
  {
    label: "Ship",
    sortOrder: 2,
    tools: [
      { name: "Vercel", note: "Hosting", logoUrl: "/logos/vercel.svg", sortOrder: 0 },
      { name: "Netlify", note: "Edge", logoUrl: "/logos/netlify.svg", sortOrder: 1 },
      { name: "Supabase", note: "Database", logoUrl: "/logos/supabase.svg", sortOrder: 2 },
      { name: "Whop", note: "Payments", logoUrl: "/logos/whop.svg", sortOrder: 3 },
      { name: "GitHub", note: "Source", logoUrl: "/logos/github.svg", sortOrder: 4 },
      { name: "Stripe", note: "Billing", logoUrl: "/logos/stripe.svg", sortOrder: 5 },
    ],
  },
  {
    label: "Create",
    sortOrder: 3,
    tools: [
      { name: "Figma", note: "Design", logoUrl: "/logos/figma.svg", sortOrder: 0 },
      { name: "After Effects", note: "Motion", logoUrl: "/logos/aftereffects.svg", sortOrder: 1 },
      { name: "Premiere", note: "Edit", logoUrl: "/logos/premiere.svg", sortOrder: 2 },
      { name: "DaVinci", note: "Grade", logoUrl: "/logos/davinci.svg", sortOrder: 3 },
      { name: "Canva", note: "Quick", logoUrl: "/logos/canva.svg", sortOrder: 4 },
    ],
  },
];

async function seedTools() {
  const client = neon(process.env.DATABASE_URL!);
  const db = drizzle(client);

  console.log("Seeding tool categories...");

  for (const cat of seedToolCategories) {
    // Upsert category by label
    const existing = await db
      .select()
      .from(toolCategories)
      .where(eq(toolCategories.label, cat.label));

    let catId: number;
    if (existing.length > 0) {
      catId = existing[0].id;
      await db
        .update(toolCategories)
        .set({ sortOrder: cat.sortOrder, updatedAt: sql`now()` })
        .where(eq(toolCategories.id, catId));
    } else {
      const [row] = await db
        .insert(toolCategories)
        .values({ label: cat.label, sortOrder: cat.sortOrder })
        .returning();
      catId = row.id;
    }
    console.log(`  ✓ Category: ${cat.label} (id: ${catId})`);

    for (const tool of cat.tools) {
      // Check if tool exists in this category
      const existingTool = await db
        .select()
        .from(tools)
        .where(eq(tools.name, tool.name));

      if (existingTool.length > 0 && existingTool[0].categoryId === catId) {
        await db
          .update(tools)
          .set({
            note: tool.note,
            logoUrl: tool.logoUrl,
            sortOrder: tool.sortOrder,
            updatedAt: sql`now()`,
          })
          .where(eq(tools.id, existingTool[0].id));
      } else if (existingTool.length === 0) {
        await db.insert(tools).values({
          categoryId: catId,
          name: tool.name,
          note: tool.note,
          logoUrl: tool.logoUrl,
          sortOrder: tool.sortOrder,
        });
      }
      console.log(`    ✓ ${tool.name}`);
    }
  }

  console.log("Tools seeded!");
}

seed().then(() => seedTools()).catch(console.error);
