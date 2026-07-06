"use client";

import { useState } from "react";
import Image from "next/image";
import { FileText, X, ExternalLink } from "lucide-react";
import { UploadButton } from "@/lib/uploadthing";

export function UploadField({
  label,
  name,
  endpoint,
  defaultUrl,
  kind,
  hint,
}: {
  label: string;
  name: string;
  endpoint: "resumeUploader" | "imageUploader";
  defaultUrl?: string | null;
  kind: "image" | "file";
  hint?: string;
}) {
  const [url, setUrl] = useState<string>(defaultUrl ?? "");

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <input type="hidden" name={name} value={url} />

      {url && (
        <div className="flex items-center gap-3 rounded-lg border border-border p-3">
          {kind === "image" ? (
            <div className="relative size-14 shrink-0 overflow-hidden rounded-md bg-muted">
              <Image src={url} alt="preview" fill className="object-cover" />
            </div>
          ) : (
            <FileText className="size-8 shrink-0 text-muted-foreground" />
          )}
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
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      <UploadButton
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          const uploaded = res?.[0]?.serverData?.url ?? res?.[0]?.ufsUrl;
          if (uploaded) setUrl(uploaded);
        }}
        onUploadError={(e: Error) => alert(`Upload failed: ${e.message}`)}
        appearance={{
          button:
            "ut-ready:bg-primary ut-uploading:cursor-not-allowed rounded-lg bg-primary text-primary-foreground text-sm h-8 px-3",
          allowedContent: "text-xs text-muted-foreground",
        }}
      />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
