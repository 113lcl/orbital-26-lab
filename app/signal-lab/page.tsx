"use client";

import { useEffect, useRef, useState } from "react";
import ExperienceNav from "../components/ExperienceNav";

type Mode = "attract" | "repel" | "vortex" | "pulse";

export default function SignalLabExperience() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modeRef = useRef<Mode>("attract");
  const burstRef = useRef(0);
  const [mode, setMode] = useState<Mode>("attract");
  const [energy, setEnergy] = useState(18);

  useEffect(() => { modeRef.current = mode; }, [mode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    let width = 0, height = 0, frame = 0;
    const pointer = { x: innerWidth / 2, y: innerHeight / 2, active: false };
    const particles = Array.from({ length: 168 }, (_, index) => ({
      x: Math.random(), y: Math.random(), vx: (Math.random() - .5) * .7, vy: (Math.random() - .5) * .7,
      radius: index % 19 === 0 ? 3.4 : Math.random() * 1.7 + .5,
    }));
    const resize = () => {
      const ratio = Math.min(devicePixelRatio, 2); width = innerWidth; height = innerHeight;
      canvas.width = width * ratio; canvas.height = height * ratio; context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    const move = (event: PointerEvent) => { pointer.x = event.clientX; pointer.y = event.clientY; pointer.active = true; };
    const burst = (event: PointerEvent) => { pointer.x = event.clientX; pointer.y = event.clientY; burstRef.current = 1; setEnergy(100); };
    const render = () => {
      context.fillStyle = "rgba(8,8,8,.24)"; context.fillRect(0, 0, width, height);
      const current = modeRef.current;
      particles.forEach((particle, index) => {
        const px = particle.x * width, py = particle.y * height;
        const dx = pointer.x - px, dy = pointer.y - py;
        const distance = Math.max(Math.hypot(dx, dy), 28);
        if (pointer.active && distance < 320) {
          const falloff = 1 - distance / 320;
          if (current === "vortex") { particle.vx += (-dy / distance) * falloff * .075; particle.vy += (dx / distance) * falloff * .075; }
          else {
            const direction = current === "repel" ? -1 : 1;
            const force = current === "pulse" ? Math.sin(Date.now() / 180) * .07 : .035 * direction;
            particle.vx += dx / distance * falloff * force; particle.vy += dy / distance * falloff * force;
          }
          if (burstRef.current > .01) { particle.vx -= dx / distance * falloff * burstRef.current * .45; particle.vy -= dy / distance * falloff * burstRef.current * .45; }
        }
        particle.vx *= .992; particle.vy *= .992; particle.x += particle.vx / width; particle.y += particle.vy / height;
        if (particle.x < 0 || particle.x > 1) particle.vx *= -1;
        if (particle.y < 0 || particle.y > 1) particle.vy *= -1;
        particle.x = Math.max(0, Math.min(1, particle.x)); particle.y = Math.max(0, Math.min(1, particle.y));
        context.beginPath(); context.fillStyle = index % 9 === 0 ? "#c7ff2f" : index % 4 === 0 ? "#8b6cff" : "rgba(240,239,231,.8)";
        context.arc(particle.x * width, particle.y * height, particle.radius, 0, Math.PI * 2); context.fill();
      });
      burstRef.current *= .93;
      frame = requestAnimationFrame(render);
    };
    resize(); render();
    window.addEventListener("resize", resize); canvas.addEventListener("pointermove", move); canvas.addEventListener("pointerdown", burst);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize); canvas.removeEventListener("pointermove", move); canvas.removeEventListener("pointerdown", burst); };
  }, []);

  useEffect(() => {
    if (energy <= 18) return;
    const timer = window.setInterval(() => setEnergy((value) => Math.max(18, value - 3)), 70);
    return () => window.clearInterval(timer);
  }, [energy]);

  return (
    <main className={`signal-world signal-${mode}`}>
      <ExperienceNav index="01" label="SIGNAL LAB" />
      <canvas ref={canvasRef} aria-label="Full-screen interactive particle field. Move to bend particles and click to release energy." />
      <div className="signal-rings" aria-hidden="true" />
      <div className="signal-title"><span>TOUCH THE</span><h1>SIGNAL</h1><p>MOVE TO BEND · CLICK TO BURST</p></div>
      <div className="signal-modes" role="group" aria-label="Particle physics mode">
        {(["attract", "repel", "vortex", "pulse"] as Mode[]).map((item) => <button key={item} className={mode === item ? "active" : ""} onClick={() => setMode(item)}>{item}</button>)}
      </div>
      <div className="energy-meter"><span>FIELD ENERGY</span><i><b style={{ width: `${energy}%` }} /></i><strong>{String(energy).padStart(3, "0")}%</strong></div>
    </main>
  );
}
