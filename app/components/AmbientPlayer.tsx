"use client";

import { useEffect, useRef, useState } from "react";

export default function AmbientPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [volume, setVolume] = useState(0.34);

  useEffect(() => {
    const storedVolume = Number(window.localStorage.getItem("orbital-volume"));
    if (Number.isFinite(storedVolume) && storedVolume >= 0 && storedVolume <= 1) {
      setVolume(storedVolume);
      if (audioRef.current) audioRef.current.volume = storedVolume;
    }
  }, []);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      try {
        await audio.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  const changeVolume = (value: number) => {
    setVolume(value);
    window.localStorage.setItem("orbital-volume", String(value));
    if (audioRef.current) audioRef.current.volume = value;
  };

  return (
    <aside className={`sound-dock ${expanded ? "is-open" : ""}`} aria-label="Ambient sound controls">
      <audio ref={audioRef} src="/distant-dawn.mp3" loop preload="metadata" onEnded={() => setPlaying(false)} />
      <button className="sound-main" type="button" onClick={togglePlayback} aria-label={playing ? "Pause ambient sound" : "Play ambient sound"}>
        <span className={`sound-bars ${playing ? "is-playing" : ""}`} aria-hidden="true"><i /><i /><i /><i /></span>
        <span>{playing ? "AMBIENT ON" : "PLAY AMBIENT"}</span>
      </button>
      <div className="sound-volume">
        <span>VOL</span>
        <input aria-label="Ambient volume" type="range" min="0" max="1" step="0.01" value={volume} onChange={(event) => changeVolume(Number(event.target.value))} />
        <output>{String(Math.round(volume * 100)).padStart(2, "0")}</output>
      </div>
      <button className="sound-expand" type="button" onClick={() => setExpanded((value) => !value)} aria-label={expanded ? "Close volume controls" : "Open volume controls"}>{expanded ? "×" : "+"}</button>
    </aside>
  );
}
