import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Henry Nicholson",
    short_name: "Henry Nicholson",
    description:
      "AI-forward Creative Developer & Designer. Junior Associate at Global Prairie; creator of Skinny Studio, vibechckd, LaunchPad, and ForeFront.",
    start_url: "/",
    display: "standalone",
    background_color: "#050508",
    theme_color: "#050508",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
