import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CodexFlow",
  description: "Coordinate coding agents with a modern operating layer for intake, execution, and review.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
