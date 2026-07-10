"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ExternalLink, UploadCloud } from "lucide-react";
import { UploadDropzone } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";

export function UploadField({
  label,
  name,
  endpoint,
  defaultUrl,
  hint,
  preview = "circle",
}: {
  label: string;
  name: string;
  endpoint: "imageUploader";
  defaultUrl?: string | null;
  kind?: "image";
  hint?: string;
  /** Shape of the thumbnail preview. Circle for avatars, rounded rect for covers. */
  preview?: "circle" | "rect";
}) {
  const [url, setUrl] = useState<string>(defaultUrl ?? "");
  const [isUploading, setIsUploading] = useState(false);

  // Reset when the server provides a different default (e.g. editing another row).
  const [prevDefault, setPrevDefault] = useState(defaultUrl);
  if (defaultUrl !== prevDefault) {
    setPrevDefault(defaultUrl);
    setUrl(defaultUrl ?? "");
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <input type="hidden" name={name} value={url} />

      <div className="space-y-3 rounded-2xl border border-border bg-card p-3 shadow-sm">
        {url && (
          <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-background p-3">
            <div
              className={cn(
                "relative shrink-0 overflow-hidden bg-muted ring-1 ring-border",
                preview === "circle"
                  ? "size-16 rounded-full"
                  : "h-16 w-24 rounded-lg",
              )}
            >
              <Image
                src={url}
                alt={`${label} preview`}
                fill
                className="object-cover"
              />
            </div>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 truncate text-sm text-muted-foreground hover:text-foreground"
            >
              <span className="inline-flex items-center gap-1">
                <ExternalLink className="size-3" />
                {url.split("/").pop()}
              </span>
            </a>
            <button
              type="button"
              onClick={() => setUrl("")}
              className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Remove"
              disabled={isUploading}
            >
              <X className="size-4" />
            </button>
          </div>
        )}

        <UploadDropzone
          endpoint={endpoint}
          config={{ mode: "auto" }}
          appearance={{
            container:
              "rounded-2xl border border-dashed border-border/70 bg-muted/20 px-4 py-8 text-center transition-colors hover:border-primary/50 hover:bg-primary/5 data-[state=uploading]:border-primary/60 data-[state=uploading]:bg-primary/5",
            label:
              "mt-3 w-full justify-center text-sm font-medium text-foreground hover:text-primary",
            allowedContent: "text-xs text-muted-foreground",
            button:
              "mt-4 inline-flex rounded-full border border-border/70 bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted",
          }}
          content={{
            uploadIcon: (
              <UploadCloud className="mx-auto size-10 text-primary" />
            ),
            label: isUploading ? "Uploading…" : "Drag and drop or browse",
            button: isUploading ? "Uploading…" : "Choose image",
          }}
          onUploadBegin={() => setIsUploading(true)}
          onClientUploadComplete={(res) => {
            const uploaded = res?.[0]?.serverData?.url ?? res?.[0]?.ufsUrl;
            if (uploaded) setUrl(uploaded);
            setIsUploading(false);
          }}
          onUploadError={(e: Error) => {
            setIsUploading(false);
            alert(`Upload failed: ${e.message}`);
          }}
          disabled={isUploading}
        />
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
