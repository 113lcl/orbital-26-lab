export default function ExperienceNav({ index, label }: { index: string; label: string }) {
  return (
    <header className="experience-nav">
      <a className="experience-brand" href="/" aria-label="Back to ORBITAL home"><b>O/</b><span>ORBITAL<br />SYSTEMS</span></a>
      <div className="experience-index">{index} / {label}</div>
      <a className="experience-exit" href="/">EXIT ORBIT ↙</a>
    </header>
  );
}
