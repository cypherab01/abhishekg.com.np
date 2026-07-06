"use server";

import { z } from "zod";
import { db } from "@/db";
import { messages } from "@/db/schema";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  email: z.string().email("Enter a valid email").max(200),
  message: z.string().min(5, "Message is too short").max(4000),
});

export type ContactState = {
  ok?: boolean;
  error?: string;
};

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    await db.insert(messages).values(parsed.data);
    return { ok: true };
  } catch {
    return { error: "Something went wrong. Please try again." };
  }
}
