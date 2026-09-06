"use client";

import { useRef, useEffect, type ReactNode, type PointerEvent as ReactPointerEvent } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-hydrated";

export function Tilt({
  children,
  strength = 0.6,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rz = useMotionValue(0);
  // reduce stiffness and increase damping to avoid bouncy vibration
  const srx = useSpring(rx, { stiffness: 120, damping: 28, mass: 0.6 });
  const sry = useSpring(ry, { stiffness: 120, damping: 28, mass: 0.6 });
  const srz = useSpring(rz, { stiffness: 120, damping: 28, mass: 0.6 });
  const reduced = useReducedMotion();

  const maxAngle = 18; // degrees

  function onMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (reduced || !ref.current) return;
    // store the latest mouse coords and schedule a RAF to update motion values
    const target = e.currentTarget as HTMLDivElement;
    lastX.current = e.clientX;
    lastY.current = e.clientY;
    lastTarget.current = target;
    if (!ticking.current) {
      ticking.current = true;
      rafId.current = requestAnimationFrame(() => {
        ticking.current = false;
        if (reduced || !lastTarget.current) return;
        const r = lastTarget.current.getBoundingClientRect();
        // if pointer is no longer over the element, reset and clear target
        if (lastX.current < r.left || lastX.current > r.right || lastY.current < r.top || lastY.current > r.bottom) {
          rx.set(0);
          ry.set(0);
          rz.set(0);
          lastTarget.current = null;
          return;
        }
        const px = (lastX.current - r.left - r.width / 2) / (r.width / 2);
        const py = (lastY.current - r.top - r.height / 2) / (r.height / 2);

        ry.set(px * maxAngle * strength);
        rx.set(-py * maxAngle * strength);

        const dist = Math.min(1, Math.sqrt(px * px + py * py));
        rz.set(Math.max(0, (1 - dist) * 20 * strength));
      });
    }
  }

  function onLeave() {
    rx.set(0);
    ry.set(0);
    rz.set(0);
    // clear stored pointer target so scroll/RAF won't keep updating this element
    lastTarget.current = null;
    // cancel any pending RAF
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
    ticking.current = false;
  }

  // refs used for RAF batching
  const lastX = useRef(0);
  const lastY = useRef(0);
  const lastTarget = useRef<HTMLDivElement | null>(null);
  const ticking = useRef(false);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  // Track global pointer moves so we have up-to-date cursor coordinates
  useEffect(() => {
    function handlePointerMove(e: PointerEvent) {
      lastX.current = e.clientX;
      lastY.current = e.clientY;
      lastPointerTime.current = Date.now();
    }
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  const lastPointerTime = useRef(0);

  // Recompute tilt when the page scrolls or resizes so the transform
  // matches the element's new position under the cursor.
  useEffect(() => {
    function handleScrollResize() {
      if (reduced || !ref.current) return;
      if (!ticking.current) {
        ticking.current = true;
        rafId.current = requestAnimationFrame(() => {
          ticking.current = false;
          if (reduced || !ref.current) return;
          const el = ref.current as HTMLDivElement;
          const r = el.getBoundingClientRect();
          // if pointer is no longer over the element, reset and clear target
          if (lastX.current < r.left || lastX.current > r.right || lastY.current < r.top || lastY.current > r.bottom) {
            rx.set(0);
            ry.set(0);
            rz.set(0);
            lastTarget.current = null;
            return;
          }

          // pointer is currently over this element (it may have scrolled there)
          lastTarget.current = el;

          const px = (lastX.current - r.left - r.width / 2) / (r.width / 2);
          const py = (lastY.current - r.top - r.height / 2) / (r.height / 2);

          ry.set(px * maxAngle * strength);
          rx.set(-py * maxAngle * strength);

          const dist = Math.min(1, Math.sqrt(px * px + py * py));
          rz.set(Math.max(0, (1 - dist) * 20 * strength));
        });
      }
    }

    window.addEventListener("scroll", handleScrollResize, { passive: true });
    window.addEventListener("resize", handleScrollResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScrollResize);
      window.removeEventListener("resize", handleScrollResize);
    };
  }, [reduced, strength, rx, ry, rz]);

  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} style={{ perspective: 1200 }} className={className}>
      <motion.div
        style={{ rotateX: srx, rotateY: sry, translateZ: srz, transformStyle: "preserve-3d", willChange: "transform" }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export default Tilt;
