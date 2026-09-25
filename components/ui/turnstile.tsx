"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

const SCRIPT_ID = "cf-turnstile-script";
const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

type TurnstileApi = {
  render: (
    el: HTMLElement,
    options: {
      sitekey: string;
      theme?: "light" | "dark" | "auto";
      size?: "normal" | "flexible" | "compact";
      callback?: (token: string) => void;
      "expired-callback"?: () => void;
      "error-callback"?: () => void;
    },
  ) => string;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

/** Load the Turnstile script once per document, shared by every caller. */
function loadScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.turnstile) return Promise.resolve();

  const existing = document.getElementById(SCRIPT_ID);
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject());
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject();
    document.head.appendChild(script);
  });
}

/**
 * Cloudflare Turnstile challenge. Renders a widget that writes its token into a
 * hidden `cf-turnstile-response` input, so a plain `<form action>` submit picks
 * it up with no extra wiring. Tokens are single-use: remount this component
 * (change its `key`) after a failed submit to get a fresh one.
 */
export function Turnstile({
  siteKey,
  onToken,
}: {
  siteKey: string;
  onToken?: (token: string | null) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [token, setToken] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const { resolvedTheme } = useTheme();

  // Keep the latest callback without re-rendering the widget when it changes.
  const onTokenRef = useRef(onToken);
  useEffect(() => {
    onTokenRef.current = onToken;
  }, [onToken]);

  useEffect(() => {
    let widgetId: string | undefined;
    let cancelled = false;

    const update = (next: string | null) => {
      setToken(next);
      onTokenRef.current?.(next);
    };

    loadScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return;
        widgetId = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme: resolvedTheme === "dark" ? "dark" : "light",
          size: "flexible",
          callback: (next) => update(next),
          "expired-callback": () => update(null),
          "error-callback": () => {
            setFailed(true);
            update(null);
          },
        });
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, [siteKey, resolvedTheme]);

  return (
    <div className="space-y-2">
      <div ref={containerRef} />
      <input type="hidden" name="cf-turnstile-response" value={token ?? ""} />
      {failed && (
        <p className="text-sm text-destructive">
          The verification widget could not load. Check your connection and
          reload the page.
        </p>
      )}
    </div>
  );
}
