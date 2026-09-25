"use client";

import { useActionState, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { submitContact, type ContactState } from "@/app/actions/contact";
import { Button } from "@/components/ui/button";
import { Turnstile } from "@/components/ui/turnstile";
import { cn } from "@/lib/utils";

const initialState: ContactState = {};

const siteKey = process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY;

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="text-sm text-destructive">
      {message}
    </p>
  );
}

/**
 * Three states, each with a job: idle, success ("You're all set."), and error
 * with a retry.
 *
 * Validation lives entirely in the server action's Zod schema — the fields
 * carry no `required` attribute and the form is `noValidate`, so the browser's
 * unstyled bubbles never fire and every message the visitor reads is ours,
 * shown under the field it belongs to.
 *
 * The inputs are controlled because React resets an uncontrolled form after a
 * form action resolves, which would wipe a long message on a failed submit.
 * A Turnstile token is single-use, so the widget is keyed on the attempt
 * counter — a failed submit remounts it and issues a fresh token.
 */
export function ContactForm() {
  const [state, formAction, pending] = useActionState(
    submitContact,
    initialState,
  );
  const [values, setValues] = useState({ name: "", email: "", message: "" });

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

  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} noValidate className="max-w-[60ch] space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, name: event.target.value }))
            }
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={cn("gfs-field", errors.name && "border-destructive")}
            placeholder="Your name"
          />
          <FieldError id="name-error" message={errors.name} />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, email: event.target.value }))
            }
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={cn("gfs-field", errors.email && "border-destructive")}
            placeholder="you@example.com"
          />
          <FieldError id="email-error" message={errors.email} />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={values.message}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, message: event.target.value }))
          }
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={cn(
            "gfs-field resize-y",
            errors.message && "border-destructive",
          )}
          placeholder="What would you like to talk about?"
        />
        <FieldError id="message-error" message={errors.message} />
      </div>

      {siteKey && <Turnstile key={state.attempt ?? 0} siteKey={siteKey} />}

      <p aria-live="polite" className="min-h-5">
        {state.error && (
          <span className="text-sm text-destructive">{state.error}</span>
        )}
      </p>

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Sending" : "Send message"}
      </Button>
    </form>
  );
}
