"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

export function PropertyGallery({ images, title }: { images: string[]; title: string }) {
  const list = images.length > 0 ? images : [""];
  const [active, setActive] = React.useState(0);
  const [lightbox, setLightbox] = React.useState(false);

  const current = list[Math.min(active, list.length - 1)];

  React.useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") setActive((a) => (a + 1) % list.length);
      if (e.key === "ArrowLeft") setActive((a) => (a - 1 + list.length) % list.length);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, list.length]);

  return (
    <div>
      <div className="grid gap-3 lg:grid-cols-[1fr_200px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="group relative aspect-[16/10] overflow-hidden rounded-3xl bg-muted"
        >
          {current ? (
            <Image
              src={current}
              alt={title}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              No image available
            </div>
          )}
          <button
            onClick={() => setLightbox(true)}
            className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-xl bg-black/50 px-3 py-2 text-xs font-semibold text-white backdrop-blur transition-colors hover:bg-black/70"
          >
            <Maximize2 className="h-3.5 w-3.5" /> View All
          </button>
          {list.length > 1 && (
            <>
              <button
                onClick={() => setActive((a) => (a - 1 + list.length) % list.length)}
                className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => setActive((a) => (a + 1) % list.length)}
                className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </motion.div>

        <div className="hidden gap-3 lg:grid">
          {list.slice(0, 4).map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                "relative aspect-[4/3] overflow-hidden rounded-xl border-2 transition-all",
                i === active
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-transparent opacity-70 hover:opacity-100"
              )}
              aria-label={`View image ${i + 1}`}
            >
              {img ? (
                <Image src={img} alt={`${title} ${i + 1}`} fill sizes="200px" className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground text-xs">
                  No image
                </div>
              )}
              {i === 3 && list.length > 4 && (
                <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-sm font-bold text-white">
                  +{list.length - 4}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              onClick={() => setLightbox(false)}
              className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label="Close lightbox"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="relative flex max-h-[85vh] w-full max-w-5xl items-center justify-center">
              <motion.div
                key={active}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl"
              >
                {list[active] ? (
                  <Image
                    src={list[active]}
                    alt={`${title} ${active + 1}`}
                    fill
                    sizes="80vw"
                    className="object-contain"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-white">No image</div>
                )}
              </motion.div>
              {list.length > 1 && (
                <>
                  <button
                    onClick={() => setActive((a) => (a - 1 + list.length) % list.length)}
                    className="absolute -left-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-2"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={() => setActive((a) => (a + 1) % list.length)}
                    className="absolute -right-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-2"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>
            <div className="absolute bottom-6 flex gap-2">
              {list.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    i === active ? "w-6 bg-white" : "w-2 bg-white/40"
                  )}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function GallerySkeleton() {
  return (
    <div className="grid gap-3 lg:grid-cols-[1fr_200px]">
      <div className="skeleton-shimmer aspect-[16/10] rounded-3xl" />
      <div className="hidden gap-3 lg:grid">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton-shimmer aspect-[4/3] rounded-xl" />
        ))}
      </div>
    </div>
  );
}
