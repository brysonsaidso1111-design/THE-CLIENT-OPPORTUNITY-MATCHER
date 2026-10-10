import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Client Opportunity Matcher",
  description: "T4L GROWTH — a structured workspace for discovering and evaluating client opportunities.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
