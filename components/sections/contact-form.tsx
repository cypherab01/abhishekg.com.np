"use client";

import { useActionState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { submitContact, type ContactState } from "@/app/actions/contact";
import { Button } from "@/components/ui/button";

const initialState: ContactState = {};

export function ContactForm() {
  const [state, formAction, pending] = useActionState(
    submitContact,
    initialState,
  );

  if (state.ok) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 p-5">
        <CheckCircle2 className="size-5 text-primary" />
        <div>
          <p className="font-medium text-foreground">Message sent</p>
          <p className="text-sm text-muted-foreground">
            Thanks for reaching out — I&apos;ll get back to you soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-sm text-foreground">
            Name
          </label>
          <input
            id="name"
            name="name"
            required
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary/50"
            placeholder="Your name"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm text-foreground">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary/50"
            placeholder="you@example.com"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <label htmlFor="message" className="text-sm text-foreground">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary/50"
          placeholder="What would you like to talk about?"
        />
      </div>
      {state.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}
      <Button type="submit" disabled={pending} size="lg">
        <Send className="size-4 mr-2" />
        {pending ? "Sending..." : "Send message"}
      </Button>
    </form>
  );
}
