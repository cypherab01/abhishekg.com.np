"use client";

import { useActionState } from "react";
import { login, type LoginState } from "../actions";
import { Button } from "@/components/ui/button";
import { inputClass } from "../_components/ui";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-foreground">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoFocus
          required
          aria-invalid={state.error ? true : undefined}
          aria-describedby={state.error ? "login-error" : undefined}
          className={inputClass}
          placeholder="••••••••"
        />
      </div>
      <p aria-live="polite" className="min-h-5">
        {state.error && (
          <span id="login-error" className="text-sm text-destructive">
            {state.error}
          </span>
        )}
      </p>
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Signing in" : "Sign in"}
      </Button>
    </form>
  );
}
