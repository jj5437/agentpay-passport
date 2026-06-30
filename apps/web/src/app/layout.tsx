import type { Metadata } from "next";
import { Geist, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap"
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap"
});

export const metadata: Metadata = {
  title: "AgentPay Passport - Regulated Command Center",
  description:
    "Policy, KYC, escrow, and receipts for AI agent payments on HashKey Chain. A HashKey-native PayFi control console.",
  icons: {
    icon: "/icon.svg"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${plusJakartaSans.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <div suppressHydrationWarning>{children}</div>
      </body>
    </html>
  );
}
