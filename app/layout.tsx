import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { getProfile } from "@/db/queries";
import type { Metadata } from "next";
import { Google_Sans_Flex, Google_Sans_Code } from "next/font/google";
import "./globals.css";

// Google Sans Flex ships under the SIL Open Font License; one variable family
// covers display and body, differentiated by size and weight rather than face.
// Next has no metric overrides for these faces, so the fallback chain is
// declared explicitly — a display headline reflowing on load is very visible.
const googleSans = Google_Sans_Flex({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-google-sans",
  fallback: ["Roboto", "system-ui", "-apple-system", "Segoe UI", "Arial", "sans-serif"],
});

const googleSansCode = Google_Sans_Code({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-google-sans-code",
  fallback: ["Roboto Mono", "ui-monospace", "monospace"],
});

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const name = profile?.name?.trim();
  const role = profile?.role?.trim();

  return {
    title: name ? `${name}${role ? ` — ${role}` : ""}` : "Portfolio",
    description:
      profile?.summary?.trim() ||
      "A personal portfolio built with Next.js and Drizzle ORM.",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={cn(
        "h-full antialiased",
        googleSans.variable,
        googleSansCode.variable,
      )}
    >
      <body className="min-h-dvh flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
