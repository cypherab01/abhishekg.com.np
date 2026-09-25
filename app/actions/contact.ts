"use server";

import { z } from "zod";
import { db } from "@/db";
import { messages } from "@/db/schema";
import { verifyTurnstile } from "@/lib/turnstile";
import { isOwnDomainEmail } from "@/lib/own-domain";

/**
 * The single source of truth for what a valid submission is. The form carries
 * no `required` attributes — the browser's native bubbles are unstyled and
 * vanish on blur, so every message the visitor sees comes from here instead.
 */
const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(120, "Name is too long"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .max(200, "Email is too long")
    .email("Enter a valid email, like you@example.com")
    .refine(
      (email) => !isOwnDomainEmail(email, process.env.NEXT_PUBLIC_APP_URL),
      "Please use your own real email address, not one at this site's domain.",
    ),
  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .min(5, "Message is too short — tell me a little more.")
    .max(4000, "Message is too long (4000 characters max)"),
});

export type ContactFieldErrors = {
  name?: string;
  email?: string;
  message?: string;
};

export type ContactState = {
  ok?: boolean;
  /** Form-level problem: verification or storage, not a specific field. */
  error?: string;
  fieldErrors?: ContactFieldErrors;
  /** Bumped on every attempt so the form can remount the single-use widget. */
  attempt?: number;
};

/** First issue per field — one message at a time reads better than a stack. */
function toFieldErrors(error: z.ZodError): ContactFieldErrors {
  const fieldErrors: ContactFieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (
      (key === "name" || key === "email" || key === "message") &&
      fieldErrors[key] === undefined
    ) {
      fieldErrors[key] = issue.message;
    }
  }
  return fieldErrors;
}

export async function submitContact(
  prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const attempt = (prev.attempt ?? 0) + 1;

  const parsed = contactSchema.safeParse({
    name: formData.get("name") ?? "",
    email: formData.get("email") ?? "",
    message: formData.get("message") ?? "",
  });

  if (!parsed.success) {
    return { fieldErrors: toFieldErrors(parsed.error), attempt };
  }

  const verification = await verifyTurnstile(
    formData.get("cf-turnstile-response"),
  );
  if (!verification.ok) {
    return { error: verification.error, attempt };
  }

  try {
    await db.insert(messages).values(parsed.data);
    return { ok: true, attempt };
  } catch {
    return { error: "Something went wrong. Please try again.", attempt };
  }
}
