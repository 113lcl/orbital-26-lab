"use client";

import { useEffect, useRef } from "react";

const interactiveSelector = [
  "a",
  "button",
  "input",
  "textarea",
  "select",
  "[role='button']",
  "[data-cursor]",
].join(",");

function cursorLabel(target: HTMLElement) {
  if (target.dataset.cursor) return target.dataset.cursor;
  if (target.matches("input[type='range']")) return "LEVEL";
  if (target.matches("a")) return "OPEN";
  if (target.matches("button,[role='button']")) return "ACT";
  return "SELECT";
}

export default function CustomCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const ring = ringRef.current;
    const dot = dotRef.current;
    const label = labelRef.current;
    const finePointer = window.matchMedia("(pointer: fine)");
    if (!root || !ring || !dot || !label || !finePointer.matches) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.documentElement.classList.add("has-custom-cursor");
    let targetX = -100;
    let targetY = -100;
    let ringX = -100;
    let ringY = -100;
    let hasPosition = false;
    let frame = 0;

    const animate = () => {
      const ease = reducedMotion ? 1 : 0.17;
      ringX += (targetX - ringX) * ease;
      ringY += (targetY - ringY) * ease;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      frame = window.requestAnimationFrame(animate);
    };

    const move = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      if (!hasPosition) {
        ringX = targetX;
        ringY = targetY;
        hasPosition = true;
      }
      dot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
      root.classList.add("is-visible");

      const element = event.target instanceof Element
        ? event.target.closest<HTMLElement>(interactiveSelector)
        : null;
      root.classList.toggle("is-interactive", Boolean(element));
      label.textContent = element ? cursorLabel(element) : "MOVE";
    };

    const press = () => root.classList.add("is-pressed");
    const release = () => root.classList.remove("is-pressed");
    const leave = (event: MouseEvent) => {
      if (!event.relatedTarget) root.classList.remove("is-visible");
    };

    frame = window.requestAnimationFrame(animate);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", press, { passive: true });
    window.addEventListener("pointerup", release, { passive: true });
    window.addEventListener("pointercancel", release, { passive: true });
    document.addEventListener("mouseout", leave);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", press);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
      document.removeEventListener("mouseout", leave);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <div ref={rootRef} className="orbital-cursor" aria-hidden="true">
      <div ref={ringRef} className="orbital-cursor-ring">
        <span ref={labelRef}>MOVE</span>
      </div>
      <span ref={dotRef} className="orbital-cursor-dot" />
    </div>
  );
}
