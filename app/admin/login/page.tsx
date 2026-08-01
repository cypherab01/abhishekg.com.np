import type { Metadata } from "next";
import { LayoutDashboard } from "lucide-react";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6">
      <div className="surface-container w-full max-w-sm rounded-3xl border border-outline-variant p-8">
        <span className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <LayoutDashboard className="size-6" aria-hidden />
        </span>
        <h1 className="mt-6 text-2xl leading-8">Welcome back</h1>
        <p className="mt-2 mb-8 text-sm text-muted-foreground">
          Enter your password to manage site content.
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
