import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-light text-foreground">Admin</h1>
        <p className="mt-1 mb-8 text-sm text-muted-foreground">
          Enter your password to manage site content.
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
