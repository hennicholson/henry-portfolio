import {
  pgTable,
  serial,
  text,
  boolean,
  integer,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull().default(""),
  description: text("description").notNull().default(""),
  url: text("url").notNull().default("#"),
  previewUrl: text("preview_url"),
  tags: jsonb("tags").$type<string[]>().notNull().default([]),
  year: text("year").notNull().default(""),
  iframeable: boolean("iframeable").notNull().default(false),
  span: integer("span").notNull().default(1),
  accent: text("accent").notNull().default(""),
  number: text("number").notNull().default(""),
  thumbnail: text("thumbnail"),
  sortOrder: integer("sort_order").notNull().default(0),
  visible: boolean("visible").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email"),
  source: text("source").notNull().default("voice_agent"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;

export const toolCategories = pgTable("tool_categories", {
  id: serial("id").primaryKey(),
  label: text("label").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  visible: boolean("visible").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const tools = pgTable("tools", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id")
    .notNull()
    .references(() => toolCategories.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  note: text("note").notNull().default(""),
  logoUrl: text("logo_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  visible: boolean("visible").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type ToolCategory = typeof toolCategories.$inferSelect;
export type NewToolCategory = typeof toolCategories.$inferInsert;
export type Tool = typeof tools.$inferSelect;
export type NewTool = typeof tools.$inferInsert;

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  text: text("text").notNull(),
  avatarUrl: text("avatar_url"),
  workplace: text("workplace"),
  color: text("color").notNull().default("rgba(59,130,246,0.25)"),
  visible: boolean("visible").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Testimonial = typeof testimonials.$inferSelect;
export type NewTestimonial = typeof testimonials.$inferInsert;

export const testimonialReactions = pgTable("testimonial_reactions", {
  id: serial("id").primaryKey(),
  testimonialId: integer("testimonial_id")
    .notNull()
    .references(() => testimonials.id, { onDelete: "cascade" }),
  emoji: text("emoji").notNull(),
  visitorId: text("visitor_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type TestimonialReaction = typeof testimonialReactions.$inferSelect;

export const guides = pgTable("guides", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull().default(""),
  summary: text("summary").notNull().default(""),
  chapters: integer("chapters").notNull().default(0),
  pages: integer("pages").notNull().default(0),
  date: text("date").notNull().default(""),
  accent: text("accent").notNull().default("#6366f1"),
  pdfUrl: text("pdf_url").notNull().default(""),
  topics: jsonb("topics").$type<string[]>().notNull().default([]),
  toc: jsonb("toc").$type<{ title: string; page: number }[]>().notNull().default([]),
  takeaways: jsonb("takeaways").$type<{ text: string }[]>().notNull().default([]),
  sortOrder: integer("sort_order").notNull().default(0),
  visible: boolean("visible").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Guide = typeof guides.$inferSelect;
export type NewGuide = typeof guides.$inferInsert;

export const guideComments = pgTable("guide_comments", {
  id: serial("id").primaryKey(),
  guideSlug: text("guide_slug").notNull(),
  chapter: text("chapter"),
  name: text("name").notNull(),
  text: text("text").notNull(),
  visitorId: text("visitor_id").notNull(),
  visible: boolean("visible").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type GuideComment = typeof guideComments.$inferSelect;
