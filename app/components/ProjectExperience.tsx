"use client";

import { useEffect, useRef, useState } from "react";
import ExperienceNav from "./ExperienceNav";

const worlds = {
  "neon-object": { no: "02.1", title: "NEON / OBJECT", line: "IDENTITY WITH MASS", copy: "A living symbol caught between geometry and instinct.", mode: "LUMEN" },
  "fluid-signal": { no: "02.2", title: "FLUID SIGNAL", line: "FORM WITHOUT EDGES", copy: "A responsive current that remembers every movement.", mode: "CURRENT" },
  afterlight: { no: "02.3", title: "AFTERLIGHT", line: "MEMORY OF MOTION", copy: "Trace the room. Every gesture leaves a temporary future behind.", mode: "TRACE" },
  "sonic-bloom": { no: "02.4", title: "SONIC / BLOOM", line: "SOUND BECOMES SHAPE", copy: "An artificial flower opening to rhythm, pressure and touch.", mode: "BLOOM" },
} as const;

export type ProjectSlug = keyof typeof worlds;

export default function ProjectExperience({ slug }: { slug: ProjectSlug }) {
  const world = worlds[slug];
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [variant, setVariant] = useState(0);
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || slug !== "afterlight") return;
    const context = canvas.getContext("2d");
    if (!context) return;
    let width = innerWidth, height = innerHeight;
    const ratio = Math.min(devicePixelRatio, 2);
    const resize = () => { width = innerWidth; height = innerHeight; canvas.width = width * ratio; canvas.height = height * ratio; context.setTransform(ratio, 0, 0, ratio, 0, 0); context.fillStyle = "#090909"; context.fillRect(0, 0, width, height); };
    const draw = (event: PointerEvent) => {
      context.fillStyle = "rgba(9,9,9,.055)"; context.fillRect(0, 0, width, height);
      const gradient = context.createRadialGradient(event.clientX, event.clientY, 0, event.clientX, event.clientY, 120 + variant * 55);
      gradient.addColorStop(0, variant === 1 ? "rgba(255,89,57,.9)" : "rgba(199,255,47,.9)"); gradient.addColorStop(1, "transparent");
      context.fillStyle = gradient; context.fillRect(event.clientX - 180, event.clientY - 180, 360, 360);
    };
    resize(); window.addEventListener("resize", resize); canvas.addEventListener("pointermove", draw);
    return () => { window.removeEventListener("resize", resize); canvas.removeEventListener("pointermove", draw); };
  }, [slug, variant]);

  const move = (event: React.PointerEvent<HTMLDivElement>) => {
    const x = event.clientX / innerWidth;
    const y = event.clientY / innerHeight;
    stageRef.current?.style.setProperty("--world-x", `${x * 100}%`);
    stageRef.current?.style.setProperty("--world-y", `${y * 100}%`);
    stageRef.current?.style.setProperty("--world-dx", `${(x - .5) * 46}px`);
    stageRef.current?.style.setProperty("--world-dy", `${(y - .5) * 34}px`);
  };

  const trigger = () => { setPulse((value) => value + 1); };

  return (
    <main className={`project-world world-${slug} variant-${variant}`}>
      <ExperienceNav index={world.no} label={world.mode} />
      <div className="project-stage" ref={stageRef} onPointerMove={move} onPointerDown={trigger}>
        {slug === "afterlight" && <canvas ref={canvasRef} aria-label="Interactive afterlight drawing surface" />}
        <div className="world-grid" aria-hidden="true" />
        <div className="world-shape shape-one" aria-hidden="true" />
        <div className="world-shape shape-two" aria-hidden="true" />
        <div className="world-shape shape-three" aria-hidden="true" />
        <div className="world-pulse" key={pulse} aria-hidden="true" />
        <div className="project-heading"><span>{world.line}</span><h1>{world.title}</h1><p>{world.copy}</p></div>
        <div className="project-instruction">MOVE / PRESS / TRANSFORM</div>
      </div>
      <div className="project-variants" role="group" aria-label="Visual state">
        {[0,1,2].map((item) => <button key={item} className={variant === item ? "active" : ""} onClick={() => setVariant(item)}><span>0{item + 1}</span>{["ORIGIN","SHIFT","MAXIMUM"][item]}</button>)}
      </div>
    </main>
  );
}
