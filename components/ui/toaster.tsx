"use client";

import { useTheme } from "next-themes";
import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  const { resolvedTheme } = useTheme();

  return (
    // Material snackbar: grey-800 fill, white label, 8px radius. Actions use
    // blue-300 because blue-600 fails contrast on a dark grey surface.
    <SonnerToaster
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      position="bottom-center"
      closeButton
      toastOptions={{
        style: {
          borderRadius: "8px",
          background: "var(--gfs-grey-800)",
          border: "none",
          color: "#ffffff",
          fontSize: "0.875rem",
          boxShadow: "var(--gfs-elev-3)",
          "--normal-text": "#ffffff",
          "--normal-border": "transparent",
          "--normal-bg": "var(--gfs-grey-800)",
        } as React.CSSProperties,
        actionButtonStyle: {
          background: "transparent",
          color: "var(--gfs-blue-300)",
          fontWeight: 500,
        },
      }}
    />
  );
}
