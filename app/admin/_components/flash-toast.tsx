"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

/**
 * Fires a success toast once when mounted, then removes the triggering query
 * param from the URL so a refresh won't repeat it. Rendered by a server page
 * only when its "saved" search param is present.
 *
 * Two guards, because one toast is what "saved" should look like: a ref that
 * survives React's development remount (Strict Mode mounts, unmounts and
 * mounts again, which ran the effect — and the toast — twice), and a stable
 * toast id, so anything that still calls through updates that toast instead
 * of stacking a second one beside it.
 */
export function FlashToast({
  message,
  param = "saved",
}: {
  message: string;
  param?: string;
}) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    toast.success(message, { id: `flash-${param}` });

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
