import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { getProfile } from "@/db/queries";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

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
      className={cn("h-full antialiased", geist.variable)}
    >
      <body className="min-h-dvh flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
