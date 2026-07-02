import { ImageResponse } from "@vercel/og";

export const runtime = "edge";
export const alt = "Henry Nicholson — Builder & Entrepreneur";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "60px 70px",
          background: "#050508",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(ellipse 80% 60% at 70% 20%, rgba(99,102,241,0.12) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 20% 80%, rgba(74,222,128,0.06) 0%, transparent 60%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "15%",
            right: "15%",
            height: "2px",
            background:
              "linear-gradient(90deg, transparent, rgba(99,102,241,0.5), transparent)",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              fontFamily: "monospace",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(99,102,241,0.7)",
              padding: "6px 14px",
              borderRadius: "100px",
              background: "rgba(99,102,241,0.08)",
              border: "1px solid rgba(99,102,241,0.15)",
            }}
          >
            Portfolio 2026
          </div>
        </div>
        <div
          style={{
            fontSize: "82px",
            fontWeight: 700,
            color: "white",
            letterSpacing: "-0.03em",
            lineHeight: 0.92,
            marginBottom: "16px",
          }}
        >
          Henry Nicholson
        </div>
        <div
          style={{
            fontSize: "28px",
            fontWeight: 300,
            color: "rgba(255,255,255,0.35)",
            letterSpacing: "-0.01em",
            marginBottom: "40px",
          }}
        >
          Builder & Entrepreneur
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          {["AI", "SaaS", "Creative", "Full-Stack"].map((tag) => (
            <div
              key={tag}
              style={{
                fontSize: "12px",
                fontFamily: "monospace",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.25)",
                padding: "6px 14px",
                borderRadius: "100px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {tag}
            </div>
          ))}
          <div
            style={{
              marginLeft: "auto",
              fontSize: "13px",
              fontFamily: "monospace",
              color: "rgba(255,255,255,0.15)",
              letterSpacing: "0.1em",
            }}
          >
            henrynicholson.dev
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
