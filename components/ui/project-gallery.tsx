"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Orientation = "landscape" | "portrait";

/** Measured shape of one screenshot. `ratio` is width ÷ height. */
type Shape = { orientation: Orientation; ratio: number };

/** Stand-in until a measurement lands — a typical browser window. */
const ASSUMED: Shape = { orientation: "landscape", ratio: 16 / 10 };

/**
 * Screenshots arrive as bare URLs with no stored dimensions, so each is decoded
 * off-DOM and measured: anything taller than it is wide is treated as a phone
 * screen, and the exact ratio drives the frame so nothing is ever cropped —
 * a tall full-page capture keeps its full length instead of losing its bottom.
 */
function useShapes(urls: string[]): Record<string, Shape> {
  const [map, setMap] = useState<Record<string, Shape>>({});
  const key = urls.join("|");

  useEffect(() => {
    let active = true;
    const list = key ? key.split("|") : [];
    Promise.all(
      list.map(
        (url) =>
          new Promise<[string, Shape]>((resolve) => {
            const img = new window.Image();
            img.onload = () => {
              const ratio = img.naturalWidth / Math.max(img.naturalHeight, 1);
              resolve([
                url,
                {
                  // Phone-shaped, not merely tall: a full-page desktop capture
                  // is also taller than it is wide, and belongs in a browser
                  // window rather than a phone bezel. Handsets land in a narrow
                  // band around 0.46–0.56.
                  orientation:
                    ratio >= 0.4 && ratio <= 0.8 ? "portrait" : "landscape",
                  ratio,
                },
              ]);
            };
            img.onerror = () => resolve([url, ASSUMED]);
            img.src = url;
          }),
      ),
    ).then((entries) => {
      if (active) setMap(Object.fromEntries(entries));
    });
    return () => {
      active = false;
    };
  }, [key]);

  return map;
}

/**
 * Device frame. Phone-shaped shots sit in a bezel, everything else in a browser
 * window — the frame tells a visitor which product they're looking at before
 * they read a word.
 *
 * `fit` decides which axis is given. "width" (the hero) takes the image's own
 * ratio, so a full-page capture keeps every pixel; its height is capped in vh
 * so a very tall one can't run off the screen, narrowing the frame instead.
 * "height" (the marquee) is a fixed strip height with the ratio setting the
 * width — tiles then share one baseline, and the full shot is a click away.
 */
function DeviceFrame({
  src,
  alt,
  shape,
  sizes,
  fit = "width",
  priority = false,
}: {
  src: string;
  alt: string;
  shape: Shape;
  sizes: string;
  fit?: "width" | "height";
  priority?: boolean;
}) {
  const byHeight = fit === "height";
  const { orientation, ratio } = shape;
  // Cap by viewport height, then let the ratio derive the width from it.
  const frameStyle = byHeight
    ? { aspectRatio: String(ratio) }
    : { width: `min(100%, calc(78vh * ${ratio}))` };
  const screenStyle = byHeight ? undefined : { aspectRatio: String(ratio) };

  if (orientation === "portrait") {
    return (
      <div
        className={cn(
          "mx-auto flex flex-col overflow-hidden rounded-[2rem] border-[6px] border-neutral-900 bg-neutral-900 shadow-elev-3 dark:border-neutral-700 dark:bg-neutral-700",
          byHeight && "h-full w-auto",
        )}
        style={frameStyle}
      >
        <div
          className={cn(
            "relative w-full overflow-hidden rounded-[1.6rem] bg-surface-sunken",
            byHeight && "min-h-0 flex-1",
          )}
          style={screenStyle}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            className="object-cover object-top"
            priority={priority}
          />
          {/* Notch pill, drawn over the screen rather than cut out of it. */}
          <span
            aria-hidden
            className="absolute left-1/2 top-2 h-1.5 w-14 -translate-x-1/2 rounded-full bg-neutral-900/70"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "mx-auto flex flex-col overflow-hidden rounded-2xl border border-outline-variant bg-surface shadow-elev-3",
        byHeight && "h-full w-auto",
      )}
      style={frameStyle}
    >
      {/* Chrome is dropped in the strip: it would eat into the tile's height
          and put the screen back out of ratio, which is what crops. */}
      {!byHeight && (
        <div className="flex shrink-0 items-center gap-1.5 px-3.5 py-2.5">
          <span className="size-2.5 rounded-full bg-outline-variant" />
          <span className="size-2.5 rounded-full bg-outline-variant" />
          <span className="size-2.5 rounded-full bg-outline-variant" />
        </div>
      )}
      <div
        className={cn(
          "relative w-full overflow-hidden border-t border-outline-variant bg-surface-sunken",
          byHeight && "min-h-0 flex-1",
        )}
        style={screenStyle}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className="object-cover object-top"
          priority={priority}
        />
      </div>
    </div>
  );
}

/**
 * The cover shot, laid back on a shallow perspective plane and scrubbed
 * upright by scroll: it sits pitched away and dropped down the page at rest,
 * and standing it up is precisely what scrolling does — the angle tracks the
 * scroll position rather than playing once on entry.
 *
 * The at-rest pose lives in CSS (`.gfs-tilt-card`) so server and client markup
 * agree, and the scrub overwrites it inline from a rAF once mounted.
 */
export function ProjectHeroShot({ src, name }: { src: string; name: string }) {
  const urls = useMemo(() => [src], [src]);
  const shape = useShapes(urls)[src] ?? ASSUMED;
  const stage = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stageEl = stage.current;
    const cardEl = card.current;
    if (!stageEl || !cardEl) return;

    // Reduced motion needs no branch here: the stylesheet pins the card
    // upright, and its `!important` outranks anything written inline below.
    let frame: number | null = null;

    const render = () => {
      frame = null;
      const scrollY = window.scrollY;
      // Anchored to scroll depth rather than viewport entry: the hero is above
      // the fold on load, so an entry-based range would already be finished
      // before the visitor had a chance to see the slope.
      const stageTop = stageEl.getBoundingClientRect().top + scrollY;
      const begin = Math.max(0, stageTop - window.innerHeight * 0.8);
      const travel = window.innerHeight * 0.6;
      const p = Math.min(1, Math.max(0, (scrollY - begin) / travel));
      // Ease-out: the pitch opens up early, then settles rather than snapping.
      const eased = 1 - Math.pow(1 - p, 3);

      const rotateX = 12 * (1 - eased);
      const translateY = 80 * (1 - eased);
      cardEl.style.transform = `translateY(${translateY}px) rotateX(${rotateX}deg)`;
    };

    const schedule = () => {
      if (frame === null) frame = requestAnimationFrame(render);
    };

    render();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={stage} className="gfs-tilt-stage mt-12">
      <div
        ref={card}
        className={cn(
          "gfs-tilt-card mx-auto px-4",
          shape.orientation === "portrait"
            ? "max-w-[340px]"
            : "max-w-[1400px] md:px-8",
        )}
      >
        <DeviceFrame
          src={src}
          alt={`A screen from ${name}.`}
          shape={shape}
          sizes={
            shape.orientation === "portrait"
              ? "340px"
              : "(max-width: 1400px) 96vw, 1400px"
          }
          priority
        />
      </div>
    </div>
  );
}

/**
 * Full-bleed marquee of every screenshot, cover included. The track is
 * rendered twice and translated by half its width, so the loop is seamless;
 * short galleries repeat first so the strip is never mostly gap. Hover pauses
 * it, and reduced motion turns it into a plain horizontal scroller. Any tile
 * opens the shot full size.
 */
export function ProjectMarquee({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const shapes = useShapes(images);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  if (images.length === 0) return null;

  const MIN_TILES = 6;
  const repeats = Math.max(1, Math.ceil(MIN_TILES / images.length));
  const track = Array.from({ length: repeats }, () => images).flat();
  // Roughly nine seconds per tile — slow enough to read a screenshot as it
  // passes rather than catch a glimpse of it.
  const duration = `${track.length * 9}s`;

  return (
    <>
      <section className="gfs-marquee mt-20" aria-label={`${name} screenshots`}>
        <div
          className="gfs-marquee-track"
          style={{ animationDuration: duration }}
        >
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              className="flex h-[260px] shrink-0 items-stretch gap-5 pr-5 md:h-[340px]"
              aria-hidden={copy === 1}
            >
              {track.map((url, i) => {
                const shape = shapes[url] ?? ASSUMED;
                const index = i % images.length;
                return (
                  <li key={`${copy}-${i}`} className="h-full">
                    <button
                      type="button"
                      // The second copy is a visual duplicate; keeping it out
                      // of the tab order stops the strip being walked twice.
                      tabIndex={copy === 1 ? -1 : undefined}
                      onClick={() => setOpenIndex(index)}
                      className="h-full cursor-zoom-in rounded-2xl"
                    >
                      <DeviceFrame
                        src={url}
                        alt={`${name} screenshot ${index + 1}. Select to view full size.`}
                        shape={shape}
                        sizes={
                          shape.orientation === "portrait" ? "200px" : "500px"
                        }
                        fit="height"
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          ))}
        </div>
      </section>

      {openIndex !== null && (
        <Lightbox
          images={images}
          index={openIndex}
          name={name}
          onIndexChange={setOpenIndex}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </>
  );
}

/**
 * Full-size viewer. The image is shown whole rather than cropped — a screenshot
 * opened to read is useless with its edges cut off — and the frame furniture is
 * dropped here for the same reason.
 */
function Lightbox({
  images,
  index,
  name,
  onIndexChange,
  onClose,
}: {
  images: string[];
  index: number;
  name: string;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}) {
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeButton.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight")
        onIndexChange((index + 1) % images.length);
      if (event.key === "ArrowLeft")
        onIndexChange((index - 1 + images.length) % images.length);
    };
    document.addEventListener("keydown", onKey);
    // The page behind must not scroll while the viewer owns the screen.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [index, images.length, onClose, onIndexChange]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${name} screenshot ${index + 1} of ${images.length}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/90 p-4 backdrop-blur-sm md:p-10"
      onClick={onClose}
    >
      <button
        ref={closeButton}
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 z-10 rounded-full bg-neutral-950/60 p-2.5 text-white backdrop-blur-sm transition-colors hover:bg-white/20 md:right-6 md:top-6"
      >
        <X className="size-6" />
      </button>

      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous screenshot"
            onClick={(event) => {
              event.stopPropagation();
              onIndexChange((index - 1 + images.length) % images.length);
            }}
            className="absolute left-2 z-10 rounded-full bg-neutral-950/60 p-2.5 text-white backdrop-blur-sm transition-colors hover:bg-white/20 md:left-6"
          >
            <ChevronLeft className="size-6" />
          </button>
          <button
            type="button"
            aria-label="Next screenshot"
            onClick={(event) => {
              event.stopPropagation();
              onIndexChange((index + 1) % images.length);
            }}
            className="absolute right-2 z-10 rounded-full bg-neutral-950/60 p-2.5 text-white backdrop-blur-sm transition-colors hover:bg-white/20 md:right-6"
          >
            <ChevronRight className="size-6" />
          </button>
        </>
      )}

      {/* Inset by the controls' width so the shot is never tucked under an
          arrow on a narrow screen, and by the counter's height at the bottom. */}
      {/* Inset by the controls' width so the shot is never tucked under an
          arrow on a narrow screen, and by the counter's height at the bottom.
          `fill` anchors to the padding box, so the padding needs its own
          wrapper to actually shrink the image. */}
      <div
        className="h-full w-full px-12 pb-10 pt-14 md:px-20 md:pb-12 md:pt-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative h-full w-full">
          <Image
            src={images[index]}
            alt={`${name} screenshot ${index + 1}.`}
            fill
            sizes="100vw"
            className="object-contain"
            priority
          />
        </div>
      </div>

      {images.length > 1 && (
        <p className="absolute bottom-5 text-sm text-white/70">
          {index + 1} / {images.length}
        </p>
      )}
    </div>
  );
}
