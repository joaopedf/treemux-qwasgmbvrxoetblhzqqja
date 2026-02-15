import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VoiceThread - AI Meeting Intelligence",
  description: "Real-time meeting transcription and intelligent action extraction",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
