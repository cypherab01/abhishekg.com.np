import "server-only";

import { headers } from "next/headers";

const VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export type TurnstileResult =
  | { ok: true }
  | { ok: false; error: string };

/**
 * Verify a Turnstile token server-side. The client-side widget proves nothing
 * on its own — only this call does.
 *
 * When neither key is configured the check is skipped outside production, so
 * local development works without a Cloudflare account. In production a
 * missing secret is a misconfiguration and fails closed.
 */
export async function verifyTurnstile(
  token: FormDataEntryValue | null,
): Promise<TurnstileResult> {
  const secret = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;

  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      console.error(
        "CLOUDFLARE_TURNSTILE_SECRET_KEY is not set; rejecting submission.",
      );
      return { ok: false, error: "Verification is unavailable right now." };
    }
    return { ok: true };
  }

  if (typeof token !== "string" || token.length === 0) {
    return { ok: false, error: "Please complete the verification challenge." };
  }

  const body = new URLSearchParams({ secret, response: token });

  const headerList = await headers();
  const remoteIp =
    headerList.get("cf-connecting-ip") ??
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (remoteIp) body.set("remoteip", remoteIp);

  try {
    const response = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
    });

    const data = (await response.json()) as {
      success?: boolean;
      "error-codes"?: string[];
    };

    if (data.success) return { ok: true };

    const codes = data["error-codes"] ?? [];
    if (
      codes.includes("timeout-or-duplicate") ||
      codes.includes("invalid-input-response")
    ) {
      return {
        ok: false,
        error: "Verification expired. Please try the challenge again.",
      };
    }

    console.error("Turnstile verification failed", codes);
    return { ok: false, error: "Verification failed. Please try again." };
  } catch {
    return { ok: false, error: "Could not reach the verification service." };
  }
}
