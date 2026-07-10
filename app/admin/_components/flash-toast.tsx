"use client";

import { useEffect } from "react";
import { toast } from "sonner";

/**
 * Fires a success toast once when mounted, then removes the triggering query
 * param from the URL so a refresh won't repeat it. Rendered by a server page
 * only when its "saved" search param is present.
 */
export function FlashToast({
  message,
  param = "saved",
}: {
  message: string;
  param?: string;
}) {
  useEffect(() => {
    toast.success(message);
    const url = new URL(window.location.href);
    if (url.searchParams.has(param)) {
      url.searchParams.delete(param);
      window.history.replaceState(
        null,
        "",
        url.pathname + url.search + url.hash,
      );
    }
  }, [message, param]);

  return null;
}
