"use client";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import { submitContact, type ContactState } from "@/app/actions/contact";
import { Button } from "@/components/ui/button";

const initialState: ContactState = {};

/**
 * Three states, each with a job: idle, success ("You're all set."), and error
 * with a retry. Errors are announced politely, never as an alert.
 */
export function ContactForm() {
  const [state, formAction, pending] = useActionState(
    submitContact,
    initialState,
  );

  if (state.ok) {
    return (
      <div
        role="status"
        className="flex max-w-[60ch] items-start gap-3 rounded-2xl bg-success-container p-6 text-on-success-container"
      >
        <CheckCircle2 className="mt-0.5 size-5 shrink-0" aria-hidden />
        <div>
          <p className="font-medium">You&apos;re all set.</p>
          <p className="mt-1 text-sm">
            Your message is on its way. I&apos;ll reply within a couple of days.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="max-w-[60ch] space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            name="name"
            required
            autoComplete="name"
            className="gfs-field"
            placeholder="Your name"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            aria-invalid={state.error ? true : undefined}
            aria-describedby={state.error ? "contact-error" : undefined}
            className="gfs-field"
            placeholder="you@example.com"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          className="gfs-field resize-y"
          placeholder="What would you like to talk about?"
        />
      </div>

      <p aria-live="polite" className="min-h-5">
        {state.error && (
          <span id="contact-error" className="text-sm text-destructive">
            {state.error}
          </span>
        )}
      </p>

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Sending" : "Send message"}
      </Button>
    </form>
  );
}
