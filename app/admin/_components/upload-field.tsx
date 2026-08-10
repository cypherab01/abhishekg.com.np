"use client";

import { useState } from "react";
import Image from "next/image";
import {
  X,
  ExternalLink,
  UploadCloud,
  ArrowLeft,
  ArrowRight,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import { UploadDropzone } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";

/**
 * UploadThing ships its own Tailwind v3 build, so its default classes are not
 * generated here — and its default button carries `text-white`, which vanishes
 * against a light surface. Every slot therefore states its own token colours,
 * marked important so a stale default can't win the cascade.
 */
const dropzoneAppearance = {
  container:
    "!rounded-2xl !border !border-dashed !border-border !bg-surface-sunken !px-4 !py-8 !text-center !transition-colors hover:!border-primary/60 hover:!bg-primary/5 data-[state=uploading]:!border-primary/60",
  label:
    "!mt-3 !w-full !justify-center !text-sm !font-medium !text-foreground hover:!text-primary",
  allowedContent: "!text-xs !text-muted-foreground",
  button:
    "!mt-4 !inline-flex !h-9 !items-center !rounded-full !border !border-border !bg-background !px-4 !text-sm !font-medium !text-foreground !shadow-sm !transition-colors hover:!bg-muted after:!bg-primary/20",
} as const;

function dropzoneContent(isUploading: boolean, multiple: boolean) {
  return {
    uploadIcon: <UploadCloud className="mx-auto size-10 text-primary" />,
    label: isUploading
      ? "Uploading…"
      : multiple
        ? "Drag and drop, or browse — multiple files allowed"
        : "Drag and drop or browse",
    button: isUploading
      ? "Uploading…"
      : multiple
        ? "Choose images"
        : "Choose image",
  };
}

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
          appearance={dropzoneAppearance}
          content={dropzoneContent(isUploading, false)}
          onUploadBegin={() => setIsUploading(true)}
          onClientUploadComplete={(res) => {
            const uploaded = res?.[0]?.serverData?.url ?? res?.[0]?.ufsUrl;
            if (uploaded) {
              setUrl(uploaded);
              toast.success(`${label} uploaded`);
            }
            setIsUploading(false);
          }}
          onUploadError={(e: Error) => {
            setIsUploading(false);
            toast.error(`Upload failed: ${e.message}`);
          }}
          disabled={isUploading}
        />
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

/**
 * Ordered gallery uploader. Posts the URLs as a JSON array under `name`; the
 * first entry is the cover, so order is editable in place rather than through
 * a separate "cover" field.
 */
export function MultiUploadField({
  label,
  name,
  endpoint,
  defaultUrls,
  hint,
}: {
  label: string;
  name: string;
  endpoint: "imageUploader";
  defaultUrls?: string[] | null;
  hint?: string;
}) {
  const [urls, setUrls] = useState<string[]>(defaultUrls ?? []);
  const [isUploading, setIsUploading] = useState(false);

  // Reset when the server provides a different default (e.g. editing another row).
  const serialisedDefault = JSON.stringify(defaultUrls ?? []);
  const [prevDefault, setPrevDefault] = useState(serialisedDefault);
  if (serialisedDefault !== prevDefault) {
    setPrevDefault(serialisedDefault);
    setUrls(defaultUrls ?? []);
  }

  function move(from: number, to: number) {
    if (to < 0 || to >= urls.length) return;
    setUrls((current) => {
      const next = [...current];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <input type="hidden" name={name} value={JSON.stringify(urls)} />

      <div className="space-y-3 rounded-2xl border border-border bg-card p-3 shadow-sm">
        {urls.length > 0 && (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {urls.map((url, i) => (
              <li
                key={url}
                className="overflow-hidden rounded-xl border border-border/70 bg-background"
              >
                <div className="relative aspect-4/3 w-full bg-muted">
                  <Image
                    src={url}
                    alt={`${label} ${i + 1}`}
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
                  {i === 0 && (
                    <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                      <Star className="size-3" aria-hidden />
                      Cover
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between gap-1 p-1.5">
                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      onClick={() => move(i, i - 1)}
                      disabled={i === 0 || isUploading}
                      className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40"
                      aria-label={`Move ${label} ${i + 1} earlier`}
                    >
                      <ArrowLeft className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(i, i + 1)}
                      disabled={i === urls.length - 1 || isUploading}
                      className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40"
                      aria-label={`Move ${label} ${i + 1} later`}
                    >
                      <ArrowRight className="size-4" />
                    </button>
                    {i !== 0 && (
                      <button
                        type="button"
                        onClick={() => move(i, 0)}
                        disabled={isUploading}
                        className="rounded-md px-1.5 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        Make cover
                      </button>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setUrls((current) => current.filter((u) => u !== url))
                    }
                    disabled={isUploading}
                    className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                    aria-label={`Remove ${label} ${i + 1}`}
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <UploadDropzone
          endpoint={endpoint}
          config={{ mode: "auto" }}
          appearance={dropzoneAppearance}
          content={dropzoneContent(isUploading, true)}
          onUploadBegin={() => setIsUploading(true)}
          onClientUploadComplete={(res) => {
            const uploaded = (res ?? [])
              .map((file) => file.serverData?.url ?? file.ufsUrl)
              .filter((u): u is string => Boolean(u));
            if (uploaded.length > 0) {
              // Dedupe: re-uploading the same file returns the same URL, and a
              // duplicate would break the list keys.
              setUrls((current) => [
                ...current,
                ...uploaded.filter((u) => !current.includes(u)),
              ]);
              toast.success(
                uploaded.length === 1
                  ? "Image uploaded"
                  : `${uploaded.length} images uploaded`,
              );
            }
            setIsUploading(false);
          }}
          onUploadError={(e: Error) => {
            setIsUploading(false);
            toast.error(`Upload failed: ${e.message}`);
          }}
          disabled={isUploading}
        />
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
