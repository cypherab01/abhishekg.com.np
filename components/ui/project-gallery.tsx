"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, Pause, Play, X } from "lucide-react";
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
 * Read once on mount and kept live: the strip swaps between a drifting marquee
 * and a static wrapped grid, and that is a render decision, not a style one —
 * the grid must never be a horizontally scrolling track in disguise.
 */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return reduced;
}

/**
 * Device frame. Phone-shaped shots sit in a bezel, everything else in a browser
 * window — the frame tells a visitor which product they're looking at before
 * they read a word.
 *
 * `fit` decides which axis is given. "width" (the hero) takes the image's own
 * ratio, so a full-page capture keeps every pixel; its height is capped in vh
 * so a very tall one can't run off the screen, narrowing the frame instead.
 * "height" (the strip) is a fixed row height with the ratio setting the
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
    : { width: `min(100%, calc(76vh * ${ratio}))` };
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
 * One screenshot as a pressable tile: the frame lifts a little under the
 * pointer and a zoom badge fades in, so the whole strip reads as openable
 * rather than as decoration that happens to react.
 */
function GalleryTile({
  src,
  alt,
  shape,
  onOpen,
  fit,
  className,
  tabIndex,
  priority = false,
}: {
  src: string;
  alt: string;
  shape: Shape;
  onOpen: () => void;
  fit: "width" | "height";
  className?: string;
  tabIndex?: number;
  priority?: boolean;
}) {
  return (
    <button
      type="button"
      tabIndex={tabIndex}
      onClick={onOpen}
      className={cn(
        "group relative cursor-zoom-in rounded-2xl transition-transform duration-300 ease-emphasized hover:-translate-y-1.5 motion-reduce:hover:translate-y-0",
        className,
      )}
    >
      <DeviceFrame
        src={src}
        alt={alt}
        shape={shape}
        sizes={
          fit === "width"
            ? shape.orientation === "portrait"
              ? "360px"
              : "(max-width: 1200px) 96vw, 1180px"
            : shape.orientation === "portrait"
              ? "260px"
              : "560px"
        }
        fit={fit}
        priority={priority}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-neutral-950/55 text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 ease-standard group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        <Expand className="size-4" />
      </span>
    </button>
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
function HeroShot({
  src,
  name,
  shape,
  onOpen,
}: {
  src: string;
  name: string;
  shape: Shape;
  onOpen: () => void;
}) {
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

      const rotateX = 8 * (1 - eased);
      const translateY = 24 * (1 - eased);
      const scale = 0.97 + 0.03 * eased;
      cardEl.style.transform = `translateY(${translateY}px) rotateX(${rotateX}deg) scale(${scale})`;
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
    <div ref={stage} className="gfs-tilt-stage relative isolate mt-6 md:mt-8">
      {/* Ambient wash so the shot sits on a stage instead of floating in an
          empty white page — the single biggest reason the old hero read flat. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 top-16 -z-10 mx-auto w-[92%] max-w-[1100px] rounded-[50%] bg-primary/10 blur-[90px] dark:bg-primary/20"
      />
      <div
        ref={card}
        className={cn(
          "gfs-tilt-card mx-auto px-4",
          shape.orientation === "portrait"
            ? "max-w-[360px]"
            : "max-w-[1180px] md:px-8",
        )}
      >
        <GalleryTile
          src={src}
          alt={`The cover screen of ${name}. Select to view full size.`}
          shape={shape}
          onOpen={onOpen}
          fit="width"
          className="block w-full"
          priority
        />
      </div>
    </div>
  );
}

/**
 * Two full-bleed rows drifting in opposite directions. Each track is rendered
 * twice and translated by half its width, so the loop is seamless; short
 * galleries repeat first so a row is never mostly gap. Hover — or the pause
 * control — stops both rows, and any tile opens the shot full size.
 *
 * There is deliberately no horizontal scrolling anywhere: when motion is
 * reduced the strip is re-rendered as a wrapped grid rather than being turned
 * into a scroller the visitor has to drag.
 */
function ScreenshotStrip({
  images,
  name,
  shapes,
  onOpen,
}: {
  images: string[];
  name: string;
  shapes: Record<string, Shape>;
  onOpen: (index: number) => void;
}) {
  const reduced = usePrefersReducedMotion();
  const [paused, setPaused] = useState(false);

  // Split across the two rows so a visitor sees twice as much at a glance and
  // neither row repeats while the other still has new shots to show.
  const rows = useMemo(() => {
    const indices = images.map((_, i) => i);
    return [
      indices.filter((i) => i % 2 === 0),
      indices.filter((i) => i % 2 === 1),
    ].filter((row) => row.length > 0);
  }, [images]);

  const tileAlt = (index: number) =>
    `${name} screenshot ${index + 1} of ${images.length}. Select to view full size.`;

  if (reduced) {
    return (
      <div className="gfs-container mt-20 md:mt-24">
        <p className="mb-5 text-sm text-muted-foreground">
          {images.length} screens · select any to view it full size
        </p>
        <ul className="flex flex-wrap justify-center gap-5">
          {images.map((url, index) => (
            <li key={url} className="h-[200px] md:h-[260px]">
              <GalleryTile
                src={url}
                alt={tileAlt(index)}
                shape={shapes[url] ?? ASSUMED}
                onOpen={() => onOpen(index)}
                fit="height"
                className="h-full"
              />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="mt-20 md:mt-24">
      <div className="gfs-container mb-5 flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {images.length} screens · select any to view it full size
        </p>
        <button
          type="button"
          onClick={() => setPaused((value) => !value)}
          aria-pressed={paused}
          className="inline-flex h-9 items-center gap-2 rounded-full border border-border px-4 text-sm font-medium text-muted-foreground transition-colors duration-200 ease-standard hover:bg-surface-sunken hover:text-foreground"
        >
          {paused ? <Play className="size-4" /> : <Pause className="size-4" />}
          {paused ? "Play" : "Pause"}
        </button>
      </div>

      <div className="space-y-5" data-paused={paused}>
        {rows.map((row, rowIndex) => {
          const MIN_TILES = 7;
          const repeats = Math.max(1, Math.ceil(MIN_TILES / row.length));
          const track = Array.from({ length: repeats }, () => row).flat();
          // Roughly nine seconds per tile — slow enough to read a screenshot
          // as it passes rather than catch a glimpse of it.
          const duration = `${track.length * 9}s`;

          return (
            <section
              key={rowIndex}
              className="gfs-marquee"
              data-paused={paused}
              aria-label={
                rowIndex === 0
                  ? `${name} screenshots`
                  : `${name} screenshots, continued`
              }
            >
              <div
                className="gfs-marquee-track"
                style={{
                  animationDuration: duration,
                  // The second row runs the other way, so the two read as a
                  // moving surface rather than one long conveyor belt.
                  animationDirection: rowIndex % 2 === 1 ? "reverse" : "normal",
                }}
              >
                {[0, 1].map((copy) => (
                  <ul
                    key={copy}
                    className="flex h-[200px] shrink-0 items-stretch gap-5 pr-5 md:h-[280px]"
                    aria-hidden={copy === 1}
                  >
                    {track.map((index, i) => (
                      <li key={`${copy}-${i}`} className="h-full">
                        <GalleryTile
                          src={images[index]}
                          alt={tileAlt(index)}
                          shape={shapes[images[index]] ?? ASSUMED}
                          onOpen={() => onOpen(index)}
                          fit="height"
                          className="h-full"
                          // The second copy is a visual duplicate; keeping it
                          // out of the tab order stops the strip being walked
                          // twice.
                          tabIndex={copy === 1 ? -1 : undefined}
                        />
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

/**
 * The whole visual half of a project page: cover shot, drifting screenshot
 * rows, and the viewer they all open into. One component because they share a
 * single measured-shape map and a single open index — clicking the cover and
 * clicking a tile land in the same gallery at the right place.
 */
export function ProjectShowcase({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const shapes = useShapes(images);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const close = useCallback(() => setOpenIndex(null), []);

  if (images.length === 0) return null;

  const cover = images[0];

  return (
    <>
      <HeroShot
        src={cover}
        name={name}
        shape={shapes[cover] ?? ASSUMED}
        onOpen={() => setOpenIndex(0)}
      />

      {images.length > 1 && (
        <ScreenshotStrip
          images={images}
          name={name}
          shapes={shapes}
          onOpen={setOpenIndex}
        />
      )}

      {openIndex !== null && (
        <Lightbox
          images={images}
          index={openIndex}
          name={name}
          onIndexChange={setOpenIndex}
          onClose={close}
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
