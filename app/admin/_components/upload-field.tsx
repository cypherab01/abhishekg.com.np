"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, ExternalLink, UploadCloud } from "lucide-react";
import { UploadDropzone } from "@/lib/uploadthing";

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
  endpoint: "imageUploader";
  defaultUrl?: string | null;
  kind: "image";
  hint?: string;
}) {
  const [url, setUrl] = useState<string>(defaultUrl ?? "");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setUrl(defaultUrl ?? "");
  }, [defaultUrl]);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <input type="hidden" name={name} value={url} />

      {url && (
        <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-background p-3 shadow-sm">
          <div className="relative size-16 shrink-0 overflow-hidden rounded-full bg-muted ring-1 ring-border">
            <Image src={url} alt="Avatar preview" fill className="object-cover" />
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
        className="mt-2"
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
          uploadIcon: <UploadCloud className="mx-auto size-10 text-primary" />,
          label: isUploading ? "Uploading avatar..." : "Drag and drop or browse",
          button: isUploading ? "Uploading..." : "Choose image",
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
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
