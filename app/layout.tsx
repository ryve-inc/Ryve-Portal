import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Ryve Portal — Distributed Storage Control Plane",
  description: "Central control plane for the Ryve distributed P2P storage mesh. Manage networks, self-hosted hardware, dedicated storage pods, and zero-knowledge encryption.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-white text-zinc-950 font-sans">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
