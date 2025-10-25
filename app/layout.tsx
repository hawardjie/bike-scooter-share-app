import type { Metadata } from "next";
import { Italiana } from "next/font/google";
import "./globals.css";

const italiana = Italiana({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-italiana',
});

export const metadata: Metadata = {
  title: "Bike & Scooter Sharing",
  description: "Real-time availability dashboard for bike and scooter sharing systems using GBFS data",
  keywords: ["bike share", "scooter share", "GBFS", "micromobility", "real-time data"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className={`${italiana.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
