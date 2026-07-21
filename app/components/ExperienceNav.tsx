import Link from "next/link";

export default function ExperienceNav({ index, label }: { index: string; label: string }) {
  return (
    <header className="experience-nav">
      <Link className="experience-brand" href="/" aria-label="Back to ORBITAL home"><b>O/</b><span>ORBITAL<br />SYSTEMS</span></Link>
      <div className="experience-index">{index} / {label}</div>
      <Link className="experience-exit" href="/">EXIT ORBIT ↙</Link>
    </header>
  );
}
