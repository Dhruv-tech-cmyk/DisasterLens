import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DisasterLens: AI Disaster Command",
  description:
    "Multi-disaster AI assessment platform with spatial intelligence for real-time flood, wildfire, and earthquake analysis using satellite imagery.",
  keywords: [
    "disaster assessment",
    "AI",
    "satellite imagery",
    "flood detection",
    "wildfire mapping",
    "earthquake damage",
    "geospatial intelligence",
  ],
  openGraph: {
    title: "DisasterLens: AI Disaster Command",
    description:
      "Real-time AI-powered multi-disaster assessment platform with spatial intelligence.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Rajdhani:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#030712] text-slate-200 antialiased">
        {children}
      </body>
    </html>
  );
}
