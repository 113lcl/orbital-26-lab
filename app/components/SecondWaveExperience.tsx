"use client";

import { useEffect, useRef, useState } from "react";
import ExperienceNav from "./ExperienceNav";

type WaveKind = "chromatic-matter" | "time-rift" | "signal-garden" | "liquid-glass";

const chapters = [
  ["00:00", "IGNITION", "A thought becomes a signal."],
  ["00:07", "DISTORTION", "The signal refuses a straight line."],
  ["00:19", "CONTACT", "Two unknown systems begin to resonate."],
  ["00:42", "GRAVITY", "Attention changes the shape of the field."],
  ["01:∞", "AFTERLIGHT", "The event ends. Its echo does not."],
] as const;

export default function SecondWaveExperience({ kind }: { kind: WaveKind }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: .5, y: .5, down: false });
  const [phase, setPhase] = useState(0);
  const [planted, setPlanted] = useState(12);
  const [palette, setPalette] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let width = 0, height = 0, frame = 0, tick = 0;
    const blobs = Array.from({ length: 16 }, (_, index) => ({
      x: Math.random(), y: Math.random(), vx: (Math.random() - .5) * .002, vy: (Math.random() - .5) * .002,
      radius: .055 + Math.random() * .105, color: index % 3,
    }));
    const shoots = Array.from({ length: planted }, (_, index) => ({
      x: planted <= 1 ? .5 : .05 + (index / (planted - 1)) * .9, height: .15 + Math.random() * .42, lean: (Math.random() - .5) * .12,
      petals: 4 + index % 5, hue: index % 3,
    }));
    const colors = palette % 2 ? ["#ff5d41", "#6d39ff", "#f1ead9"] : ["#c7ff2f", "#6d39ff", "#101010"];

    const resize = () => {
      const ratio = Math.min(devicePixelRatio, 2); width = innerWidth; height = innerHeight;
      canvas.width = width * ratio; canvas.height = height * ratio; ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const liquid = () => {
      ctx.fillStyle = palette % 2 ? "#130706" : "#050507"; ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";
      blobs.forEach((blob, index) => {
        const dx = pointer.current.x - blob.x, dy = pointer.current.y - blob.y;
        const distance = Math.max(.04, Math.hypot(dx, dy));
        if (distance < .34) { const force = pointer.current.down ? .00022 : .000055; blob.vx += dx / distance * force; blob.vy += dy / distance * force; }
        blob.vx *= .992; blob.vy *= .992; blob.x += blob.vx; blob.y += blob.vy;
        if (blob.x < -.1 || blob.x > 1.1) blob.vx *= -1; if (blob.y < -.1 || blob.y > 1.1) blob.vy *= -1;
        const x = blob.x * width, y = blob.y * height, radius = blob.radius * Math.min(width, height) * (1 + Math.sin(tick * .012 + index) * .1);
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, colors[blob.color]); gradient.addColorStop(.38, colors[blob.color]); gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient; ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill();
      });
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(5,5,7,.2)"; ctx.fillRect(0, 0, width, height);
    };

    const garden = () => {
      ctx.fillStyle = "#e8e4d8"; ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = "rgba(10,10,9,.12)"; ctx.lineWidth = 1;
      for (let y = 0; y < height; y += 28) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); }
      const wind = (pointer.current.x - .5) * .15;
      shoots.forEach((shoot, index) => {
        const baseX = shoot.x * width, baseY = height * .9;
        const growth = Math.min(1, tick / 80 + index * .06);
        const topY = baseY - shoot.height * height * growth;
        const topX = baseX + (shoot.lean + wind) * height * growth;
        ctx.beginPath(); ctx.strokeStyle = "#121211"; ctx.lineWidth = index % 4 === 0 ? 2 : 1;
        ctx.moveTo(baseX, baseY); ctx.quadraticCurveTo(baseX - wind * 180, (baseY + topY) / 2, topX, topY); ctx.stroke();
        const petalColor = shoot.hue === 0 ? "#6b39ff" : shoot.hue === 1 ? "#c7ff2f" : "#ff6148";
        for (let p = 0; p < shoot.petals; p++) {
          const angle = p / shoot.petals * Math.PI * 2 + tick * .002 * (index % 2 ? 1 : -1);
          ctx.save(); ctx.translate(topX, topY); ctx.rotate(angle); ctx.scale(1, .45);
          ctx.beginPath(); ctx.fillStyle = petalColor; ctx.arc(16 * growth, 0, (7 + index % 4) * growth, 0, Math.PI * 2); ctx.fill(); ctx.restore();
        }
        ctx.beginPath(); ctx.fillStyle = "#111"; ctx.arc(topX, topY, 3.2 * growth, 0, Math.PI * 2); ctx.fill();
      });
    };

    const timeline = () => {
      ctx.fillStyle = "#d7ff39"; ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = "rgba(9,9,8,.18)";
      for (let x = -height; x < width + height; x += 52) { ctx.beginPath(); ctx.moveTo(x + tick % 52, 0); ctx.lineTo(x - height + tick % 52, height); ctx.stroke(); }
    };

    const glass = () => {
      const px = pointer.current.x * width, py = pointer.current.y * height;
      ctx.fillStyle = "#dfe3ef"; ctx.fillRect(0, 0, width, height);
      const fields = palette % 2
        ? [[width * .18, height * .35, "#ff5d8f"], [width * .76, height * .25, "#ffe75a"], [width * .62, height * .82, "#6d39ff"], [px, py, "#75f4cf"]] as const
        : [[width * .18, height * .35, "#7040ff"], [width * .76, height * .25, "#c7ff2f"], [width * .62, height * .82, "#ff6148"], [px, py, "#61d9ff"]] as const;
      fields.forEach(([x, y, color], index) => {
        const radius = Math.min(width, height) * (.2 + index * .025) + Math.sin(tick * .012 + index) * 22;
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, color); gradient.addColorStop(.42, `${color}99`); gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient; ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill();
      });
      ctx.strokeStyle = "rgba(10,10,20,.12)";
      for (let x = 0; x < width; x += 48) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke(); }
      for (let y = 0; y < height; y += 48) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); }
    };

    const render = () => { tick++; kind === "chromatic-matter" ? liquid() : kind === "signal-garden" ? garden() : kind === "liquid-glass" ? glass() : timeline(); frame = requestAnimationFrame(render); };
    resize(); render(); window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize); };
  }, [kind, palette, planted]);

  const move = (event: React.PointerEvent<HTMLElement>) => {
    pointer.current.x = event.clientX / innerWidth; pointer.current.y = event.clientY / innerHeight;
    event.currentTarget.style.setProperty("--glass-x", `${event.clientX}px`);
    event.currentTarget.style.setProperty("--glass-y", `${event.clientY}px`);
    event.currentTarget.style.setProperty("--glass-rx", `${(.5 - pointer.current.y) * 12}deg`);
    event.currentTarget.style.setProperty("--glass-ry", `${(pointer.current.x - .5) * 15}deg`);
  };
  const down = (event: React.PointerEvent<HTMLElement>) => {
    pointer.current.down = true; move(event);
    if (kind === "signal-garden") setPlanted((value) => value + 1);
  };
  const wheel = (event: React.WheelEvent<HTMLElement>) => {
    if (kind !== "time-rift") return;
    setPhase((value) => Math.max(0, Math.min(chapters.length - 1, value + (event.deltaY > 0 ? 1 : -1))));
  };

  return (
    <main className={`wave-world wave-${kind}`} onPointerMove={move} onPointerDown={down} onPointerUp={() => { pointer.current.down = false; }} onWheel={wheel}>
      <ExperienceNav index={kind === "chromatic-matter" ? "07.1" : kind === "time-rift" ? "07.2" : kind === "signal-garden" ? "07.3" : "07.4"} label={kind.replaceAll("-", " ").toUpperCase()} />
      <canvas ref={canvasRef} aria-label={`${kind.replaceAll("-", " ")} interactive canvas`} />
      {kind === "chromatic-matter" && <>
        <div className="wave-copy"><span>REAL-TIME / SYNTHETIC FLUID</span><h1>CHROMATIC<br /><i>MATTER</i></h1><p>Move to attract the material. Hold to increase gravity.</p></div>
        <button className="wave-button" onPointerDown={(e) => e.stopPropagation()} onClick={() => setPalette((value) => value + 1)}>SHIFT SPECTRUM ↗</button>
        <div className="matter-cursor" aria-hidden="true" />
      </>}
      {kind === "time-rift" && <>
        <div className="rift-counter">0{phase + 1} / 0{chapters.length}</div>
        <div className="rift-stage" style={{ "--rift": phase } as React.CSSProperties}>
          {chapters.map((chapter, index) => <article className={index === phase ? "active" : ""} key={chapter[1]}>
            <span>{chapter[0]}</span><h2>{chapter[1]}</h2><p>{chapter[2]}</p><b>{String(index + 1).padStart(2, "0")}</b>
          </article>)}
        </div>
        <div className="rift-instruction">SCROLL TO FRACTURE TIME ↓</div>
        <div className="rift-nav">{chapters.map((chapter, index) => <button key={chapter[1]} className={phase === index ? "active" : ""} onClick={() => setPhase(index)}>{chapter[0]}</button>)}</div>
      </>}
      {kind === "signal-garden" && <>
        <div className="garden-copy"><span>GENERATIVE SPECIES / {String(planted).padStart(3, "0")}</span><h1>SIGNAL<br />GARDEN</h1><p>Move to change the wind. Click anywhere to grow a new transmission.</p></div>
        <button className="wave-button garden-reset" onPointerDown={(e) => e.stopPropagation()} onClick={() => setPlanted(12)}>RESET GROWTH ↗</button>
      </>}
      {kind === "liquid-glass" && <>
        <div className="glass-copy"><span>MATERIAL STUDY / REFRACTION 01</span><h1>LIQUID<br /><i>GLASS</i></h1><p>Move to bend the lens. The interface behaves like a material, not a layer.</p></div>
        <div className="glass-lens" aria-hidden="true"><i /><b /><span>REFRACTION<br />INDEX 1.52</span></div>
        <div className="glass-stack" aria-hidden="true"><i /><i /><i /></div>
        <button className="wave-button glass-button" onPointerDown={(e) => e.stopPropagation()} onClick={() => setPalette((value) => value + 1)}>REFRACT LIGHT ↗</button>
      </>}
      <div className="wave-status"><span>ORBITAL EXPERIMENT / 2026</span><span>POINTER INPUT / ACTIVE</span><b>LIVE ●</b></div>
    </main>
  );
}
