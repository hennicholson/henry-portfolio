import { NextRequest, NextResponse } from "next/server";

export interface BrandData {
  favicon: string | null;
  ogImage: string | null;
  themeColor: string | null;
  title: string | null;
  description: string | null;
  screenshot: string | null;
}

// In-memory cache (survives across requests within same serverless instance)
const cache = new Map<string, { data: BrandData; ts: number }>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url || url === "#") {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  // Check cache
  const cached = cache.get(url);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; PortfolioBrandScraper/1.0)",
        Accept: "text/html",
      },
      signal: AbortSignal.timeout(8000),
    });

    const html = await res.text();
    const brand = extractBrandData(html, url);

    cache.set(url, { data: brand, ts: Date.now() });
    return NextResponse.json(brand);
  } catch (error) {
    console.error("Brand scrape error:", error);
    return NextResponse.json({
      favicon: null,
      ogImage: null,
      themeColor: null,
      title: null,
      description: null,
      screenshot: null,
    } satisfies BrandData);
  }
}

function extractBrandData(html: string, baseUrl: string): BrandData {
  const resolve = (href: string | null): string | null => {
    if (!href) return null;
    try {
      return new URL(href, baseUrl).href;
    } catch {
      return null;
    }
  };

  // og:image
  const ogImage =
    matchMeta(html, 'property="og:image"') ||
    matchMeta(html, "property='og:image'") ||
    matchMeta(html, 'name="twitter:image"') ||
    matchMeta(html, "name='twitter:image'");

  // theme-color
  const themeColor =
    matchMeta(html, 'name="theme-color"') ||
    matchMeta(html, "name='theme-color'");

  // favicon
  const faviconMatch = html.match(/<link[^>]*rel=["'](?:icon|shortcut icon)["'][^>]*href=["']([^"']+)["']/i);
  const favicon = faviconMatch ? resolve(faviconMatch[1]) : resolve("/favicon.ico");

  // title
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const ogTitle = matchMeta(html, 'property="og:title"') || matchMeta(html, "property='og:title'");
  const title = ogTitle || (titleMatch ? titleMatch[1].trim() : null);

  // description
  const description =
    matchMeta(html, 'property="og:description"') ||
    matchMeta(html, "property='og:description'") ||
    matchMeta(html, 'name="description"') ||
    matchMeta(html, "name='description'");

  return {
    favicon,
    ogImage: resolve(ogImage),
    themeColor,
    title,
    description,
    screenshot: null, // future: could use screenshotting service
  };
}

function matchMeta(html: string, attr: string): string | null {
  // Try content after the attribute
  const re1 = new RegExp(`<meta[^>]*${attr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^>]*content=["']([^"']+)["']`, "i");
  const m1 = html.match(re1);
  if (m1) return m1[1];

  // Try content before the attribute
  const re2 = new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*${attr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, "i");
  const m2 = html.match(re2);
  if (m2) return m2[1];

  return null;
}
