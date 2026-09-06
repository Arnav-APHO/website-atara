import { useEffect, useRef, useState } from "react";
import { useHydrated, useReducedMotion } from "@/hooks/use-hydrated";

type CursorTone = "dark" | "light";

const cursorPalette = {
  dark: {
    line: "#f7f2dc",
    fill: "rgb(247 242 220 / 16%)",
    glow: "rgb(247 242 220 / 28%)",
  },
  light: {
    line: "#04615a",
    fill: "rgb(4 97 90 / 13%)",
    glow: "rgb(4 97 90 / 26%)",
  },
} as const;

function toTone(rgb: [number, number, number]) {
  const [r, g, b] = rgb.map((value) => {
    const channel = value / 255;
    return channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
  });
  // The light brochure paper and bright leaf green use the forest cursor.
  // Deep teal and ink surfaces use the paper cursor for reliable contrast.
  return r * 0.2126 + g * 0.7152 + b * 0.0722 < 0.22 ? "dark" : "light";
}

function backgroundToneAt(x: number, y: number): CursorTone {
  for (const node of document.elementsFromPoint(x, y)) {
    if (!(node instanceof HTMLElement)) continue;

    // Check if the node itself or a close ancestor is an active hover card.
    // Active cards (.team-card, .stats-card) turn dark green/ink, requiring light/paper cursor tone ("dark").
    const activeCard = node.closest<HTMLElement>("[data-cursor-active='true']");
    if (activeCard) {
      return "dark";
    }

    const explicitTone = node.closest<HTMLElement>("[data-cursor-tone]")?.dataset.cursorTone;
    if (explicitTone === "dark" || explicitTone === "light") return explicitTone;

    const background = getComputedStyle(node).backgroundColor;
    const match = background.match(/rgba?\((\d+)[,\s]+(\d+)[,\s]+(\d+)(?:[,\s/]+([\d.]+))?\)/);
    if (!match || (match[4] && Number(match[4]) < 0.65)) continue;

    return toTone([Number(match[1]), Number(match[2]), Number(match[3])]);
  }

  return "light";
}

export function CustomCursor() {
  const hydrated = useHydrated();
  const reduced = useReducedMotion();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const textBarRef = useRef<HTMLDivElement>(null);
  const scrollCursorRef = useRef<HTMLDivElement>(null);
  const toneRef = useRef<CursorTone>("light");
  const activeRef = useRef(false);
  const textActiveRef = useRef(false);
  const [active, setActive] = useState(false);
  const [textActive, setTextActive] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [scrollMode, setScrollMode] = useState(false);
  const scrollStateRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0,
    scrollInterval: null as number | null,
    velocityX: 0,
    velocityY: 0,
  });

  useEffect(() => {
    if (!hydrated) return;
    const canHover = window.matchMedia("(any-hover: hover)").matches;
    const hasFinePointer = window.matchMedia("(any-pointer: fine)").matches;
    setEnabled(canHover && hasFinePointer && !reduced);
  }, [hydrated, reduced]);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("custom-cursor-enabled");
    const style = document.createElement("style");
    style.setAttribute("data-atara-cursor", "");
    style.textContent = `
      html, body, *, input, textarea, [contenteditable="true"] { cursor: none !important; }
    `;
    document.head.appendChild(style);
    return () => {
      document.documentElement.classList.remove("custom-cursor-enabled");
      style.remove();
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let ringX = x;
    let ringY = y;
    let previousX = x;
    let previousY = y;
    let rafId = 0;
    let activeElement: Element | null = null;

    const setTone = (tone: CursorTone) => {
      if (toneRef.current === tone) return;
      toneRef.current = tone;
      const colors = cursorPalette[tone];
      document.documentElement.style.setProperty("--atara-cursor-line", colors.line);
      document.documentElement.style.setProperty("--atara-cursor-fill", colors.fill);
      document.documentElement.style.setProperty("--atara-cursor-glow", colors.glow);
    };

    // Initialise CSS variables before the first pointer movement.
    toneRef.current = "dark";
    setTone("light");

    const setActiveAt = (pointerX: number, pointerY: number) => {
      const target = document.elementFromPoint(pointerX, pointerY);
      const nextCardElement =
        target instanceof Element ? target.closest("[data-cursor-card]") : null;
      const nextLinkElement = target instanceof Element ? target.closest("a[href], button, [role='button'], label, input, select, textarea, [tabindex]:not([tabindex='-1'])") : null;
      const nextActive = Boolean(nextLinkElement);

      const isInput =
        target instanceof Element &&
        (target.matches("input, textarea, [contenteditable]") ||
         target.closest("input, textarea, [contenteditable]"));
      const nextTextActive = Boolean(isInput);

      if (activeElement !== nextCardElement) {
        activeElement?.removeAttribute("data-cursor-active");
        activeElement = nextCardElement;
        activeElement?.setAttribute("data-cursor-active", "true");
      }

      if (activeRef.current !== nextActive) {
        activeRef.current = nextActive;
        setActive(nextActive);
      }

      if (textActiveRef.current !== nextTextActive) {
        textActiveRef.current = nextTextActive;
        setTextActive(nextTextActive);
      }
    };
    const syncCursorSurface = () => {
      setTone(backgroundToneAt(x, y));
      setActiveAt(x, y);
    };
    const onMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      syncCursorSurface();
    };
    const onOver = () => setActiveAt(x, y);
    // Scroll can move an interactive element under a stationary cursor, so
    // both colour and hover shape must update without another mouse movement.
    let scrollTicking = false;
    const onScroll = () => {
      if (!scrollTicking) {
        scrollTicking = true;
        requestAnimationFrame(() => {
          syncCursorSurface();
          scrollTicking = false;
        });
      }
    };
    // Observe DOM changes and refresh the cursor on the next frame.
    const observer = new MutationObserver(() => {
      requestAnimationFrame(syncCursorSurface);
    });

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    // ── Middle-click auto-scroll ──
    let scrollState = scrollStateRef.current;

    const onMiddleDown = (e: MouseEvent) => {
      if (e.button !== 1) return;
      e.preventDefault();
      scrollState.active = true;
      scrollState.startX = e.clientX;
      scrollState.startY = e.clientY;
      scrollState.offsetX = 0;
      scrollState.offsetY = 0;
      scrollState.velocityX = 0;
      scrollState.velocityY = 0;
      setScrollMode(true);

      if (scrollCursorRef.current) {
        scrollCursorRef.current.style.display = "block";
      }
    };

    const onMiddleMove = (e: MouseEvent) => {
      if (!scrollState.active) return;
      // Allow the cursor to update its position for the scroll cursor
      x = e.clientX;
      y = e.clientY;
      scrollState.offsetX = e.clientX - scrollState.startX;
      scrollState.offsetY = e.clientY - scrollState.startY;
      scrollState.velocityX = scrollState.offsetX * 0.5;
      scrollState.velocityY = scrollState.offsetY * 0.5;

      // Update the scroll cursor position and rotation
      if (scrollCursorRef.current) {
        const angle = Math.atan2(scrollState.offsetY, scrollState.offsetX) * (180 / Math.PI);
        const dist = Math.min(Math.hypot(scrollState.offsetX, scrollState.offsetY), 80);
        const arrowScale = dist / 80;
        scrollCursorRef.current.style.transform =
          `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
        scrollCursorRef.current.style.setProperty("--scroll-angle", `${angle}deg`);
        scrollCursorRef.current.style.setProperty("--scroll-intensity", String(arrowScale));
      }
    };

    const onMiddleUp = (e: MouseEvent) => {
      if (e.button !== 1) return;
      scrollState.active = false;
      scrollState.offsetX = 0;
      scrollState.offsetY = 0;
      scrollState.velocityX = 0;
      scrollState.velocityY = 0;
      setScrollMode(false);
      if (scrollCursorRef.current) {
        scrollCursorRef.current.style.display = "none";
      }
    };

    // Use a separate tick for auto-scrolling
    const scrollTick = () => {
      if (scrollState.active) {
        const s = scrollState;
        // Apply scroll with inertia
        s.velocityX *= 0.92;
        s.velocityY *= 0.92;
        if (Math.abs(s.velocityX) > 0.5 || Math.abs(s.velocityY) > 0.5) {
          window.scrollBy({
            left: Math.round(s.velocityX * 0.15),
            top: Math.round(s.velocityY * 0.15),
          });
        }
      }
    };

    // Integrate scrollTick into the main RAF
    const frame = () => {
      scrollTick();
      syncCursorSurface();
      const isText = textActiveRef.current;

      ringX += (x - ringX) * 0.18;
      ringY += (y - ringY) * 0.18;
      const velocityX = x - previousX;
      const velocityY = y - previousY;
      previousX = x;
      previousY = y;
      const speed = Math.min(Math.hypot(velocityX, velocityY), 60);
      const angle = (Math.atan2(velocityY, velocityX) * 180) / Math.PI;
      const scaleX = 1 + speed / 120;
      const scaleY = 1 - speed / 300;
      const tilt = Math.max(-25, Math.min(25, velocityX * 1.2));

      // Don't show ring/dot while in scroll mode
      const inScrollMode = scrollState.active;

      if (ringRef.current) {
        const ringW = inScrollMode ? 0 : isText ? 2 : activeRef.current ? 62 : 34;
        const ringH = inScrollMode ? 0 : isText ? 28 : activeRef.current ? 62 : 34;
        ringRef.current.style.display = inScrollMode || isText ? "none" : "block";
        ringRef.current.style.width = ringW + "px";
        ringRef.current.style.height = ringH + "px";
        ringRef.current.style.borderRadius = isText ? "2px" : "";
        ringRef.current.style.transform =
          `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) ` +
          (isText ? "" : `rotate(${angle}deg) rotateY(${tilt}deg) rotateX(${-velocityY * 1.2}deg) `) +
          `scale(${isText ? 1 : scaleX}, ${isText ? 1 : scaleY})`;
      }

      // Constrain the dot to never leave the ring
      const constrainRingRadius = activeRef.current ? 31 : 17;
      const constrainDotRadius = 4;
      const maxDist = constrainRingRadius - constrainDotRadius;
      const dx = x - ringX;
      const dy = y - ringY;
      const dist = Math.hypot(dx, dy);
      let dotX: number, dotY: number;
      if (dist > maxDist && maxDist > 0) {
        const ratio = maxDist / dist;
        dotX = ringX + dx * ratio;
        dotY = ringY + dy * ratio;
      } else {
        dotX = x;
        dotY = y;
      }

      if (dotRef.current) {
        dotRef.current.style.display = inScrollMode || isText ? "none" : "block";
        dotRef.current.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
      }

      if (textBarRef.current) {
        textBarRef.current.style.display = inScrollMode ? "none" : isText ? "block" : "none";
        textBarRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      }
      rafId = requestAnimationFrame(frame);
    };

    document.addEventListener("mousedown", onMiddleDown, { passive: false });
    document.addEventListener("mousemove", onMiddleMove, { passive: true });
    document.addEventListener("mouseup", onMiddleUp, { passive: false });
    observer.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ["class", "data-cursor-tone"],
    });
    rafId = requestAnimationFrame(frame);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mousedown", onMiddleDown);
      document.removeEventListener("mousemove", onMiddleMove);
      document.removeEventListener("mouseup", onMiddleUp);
      observer.disconnect();
      cancelAnimationFrame(rafId);
      activeElement?.removeAttribute("data-cursor-active");
      document.documentElement.style.removeProperty("--atara-cursor-line");
      document.documentElement.style.removeProperty("--atara-cursor-fill");
      document.documentElement.style.removeProperty("--atara-cursor-glow");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] rounded-full border-2 transition-[width,height,opacity,background-color,border-color] duration-500 ease-out"
        style={{
          width: 34,
          height: 34,
          opacity: 0.9,
          borderColor: "var(--atara-cursor-line)",
          backgroundColor: "transparent",
          transformStyle: "preserve-3d",
          willChange: "transform, width, height",
          boxShadow: "0 8px 22px var(--atara-cursor-glow)",
        }}
      />
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[101] h-2 w-2 rounded-full"
        style={{
          backgroundColor: "var(--atara-cursor-line)",
          boxShadow: "0 0 12px var(--atara-cursor-glow)",
          willChange: "transform",
        }}
      />
      <div
        ref={textBarRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[101]"
        style={{
          width: 1.5,
          height: 22,
          backgroundColor: "var(--atara-cursor-line)",
          boxShadow: "0 0 8px var(--atara-cursor-glow)",
          borderRadius: 1,
          willChange: "transform",
          display: "none",
        }}
      />
      {/* ── Middle-click scroll cursor ── */}
      <div
        ref={scrollCursorRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[102]"
        style={{
          width: 48,
          height: 48,
          display: "none",
          willChange: "transform",
        }}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          className="h-full w-full"
        >
          {/* Up arrow — bright when moving up (angle ≈ -90°) */}
          <path
            d="M24 6 L20 14 L28 14 Z"
            fill="var(--atara-cursor-line)"
            style={{
              opacity: "calc(0.3 + 0.7 * max(0, -1 * sin(var(--scroll-angle, 0deg))))",
              transition: "opacity 0.15s ease",
            }}
          />
          {/* Down arrow — bright when moving down (angle ≈ 90°) */}
          <path
            d="M24 42 L20 34 L28 34 Z"
            fill="var(--atara-cursor-line)"
            style={{
              opacity: "calc(0.3 + 0.7 * max(0, sin(var(--scroll-angle, 0deg))))",
              transition: "opacity 0.15s ease",
            }}
          />
          {/* Left arrow — bright when moving left (angle ≈ 180° / -180°) */}
          <path
            d="M6 24 L14 20 L14 28 Z"
            fill="var(--atara-cursor-line)"
            style={{
              opacity: "calc(0.3 + 0.7 * max(0, -1 * cos(var(--scroll-angle, 0deg))))",
              transition: "opacity 0.15s ease",
            }}
          />
          {/* Right arrow — bright when moving right (angle ≈ 0°) */}
          <path
            d="M42 24 L34 20 L34 28 Z"
            fill="var(--atara-cursor-line)"
            style={{
              opacity: "calc(0.3 + 0.7 * max(0, cos(var(--scroll-angle, 0deg))))",
              transition: "opacity 0.15s ease",
            }}
          />
          {/* Center dot */}
          <circle
            cx="24"
            cy="24"
            r="3"
            fill="var(--atara-cursor-line)"
            opacity={0.7}
          />
        </svg>
      </div>
    </>
  );
}
