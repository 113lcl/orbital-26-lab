"use client";

import { useEffect, useState } from "react";
import ExperienceNav from "../components/ExperienceNav";

const records = [
  { title: "TOKYO TYPE", year: "2026", signal: "KANJI / MOTION", color: "#c7ff2f" },
  { title: "SUBZERO", year: "2025", signal: "ICE / SYSTEM", color: "#75dfff" },
  { title: "LOST SIGNAL", year: "2024", signal: "NOISE / MEMORY", color: "#8b6cff" },
  { title: "MARS/01", year: "2023", signal: "DUST / HABITAT", color: "#ff654d" },
  { title: "NIGHTSHIFT", year: "2022", signal: "CITY / AFTERDARK", color: "#e64cff" },
  { title: "KINETIC FM", year: "2021", signal: "RADIO / ENERGY", color: "#f4efdf" },
];

export default function ArchiveExperience() {
  const [active, setActive] = useState(0);
  const [running, setRunning] = useState(true);
  const record = records[active];

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setActive((value) => (value + 1) % records.length), 4200);
    return () => window.clearInterval(timer);
  }, [running]);

  const select = (index: number) => { setActive(index); setRunning(false); };

  return (
    <main className="archive-world" style={{ "--archive-color": record.color } as React.CSSProperties}>
      <ExperienceNav index="05" label="ARCHIVE TRANSMISSION" />
      <section className="archive-console">
        <div className="archive-copy"><span>LIVE MEMORY DECK / {record.year}</span><h1>{record.title}</h1><p>{record.signal}</p></div>
        <div className={`archive-sculpture sculpture-${active}`} aria-hidden="true"><i /><b /><em /></div>
        <div className="archive-frequency" aria-hidden="true">{Array.from({ length: 38 }, (_, index) => <i key={index} style={{ height: `${18 + ((index * 17 + active * 29) % 78)}%` }} />)}</div>
        <button className="archive-play" type="button" onClick={() => setRunning((value) => !value)}>{running ? "PAUSE TRANSMISSION" : "RESUME TRANSMISSION"}</button>
      </section>
      <nav className="archive-timeline" aria-label="Archive records">
        {records.map((item, index) => <button key={item.title} className={active === index ? "active" : ""} onClick={() => select(index)}><span>0{index + 1}</span><strong>{item.title}</strong><small>{item.year}</small></button>)}
      </nav>
    </main>
  );
}
