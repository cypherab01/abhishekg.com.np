import type { Metadata } from "next";
import { Ubuntu } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";
import { Separator } from "@/components/ui/separator";

const ubuntu = Ubuntu({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Abhishek Ghimire | cypherab01",
  description: "Abhishek Ghimire",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${ubuntu.className} antialiased mx-auto max-w-screen-md`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <header className=" p-2 md:p-4">
            <Navbar />
          </header>
          <Separator className="mb-4" />
          <main className=" p-2 md:p-4">{children}</main>
          <Separator className="my-4" />

          <footer className=" p-2 md:p-4">
            <Footer />
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
