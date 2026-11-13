import { useEffect, useRef, useState } from "react";
import introImg from "./assets/intro.jpg";
import artFull from "./assets/art.jpg";
import artTop from "./assets/art-top.jpg";
import artBot from "./assets/art-bot.jpg";
import { D } from "./data.js";

// Lotus mandala (rangoli) — petal rings are generated, then drawn stroke by stroke
const pt = (r, a) => [Math.cos(a) * r, Math.sin(a) * r].map((v) => v.toFixed(1)).join(" ");
const ring = (n, r1, r2, w, off = 0) => Array.from({ length: n }, (_, i) => {
  const a = off + (i * 2 * Math.PI) / n, m = (r1 + r2) / 2;
  return `M${pt(r1, a - w)} Q${pt(m, a - w * 1.7)} ${pt(r2, a)} Q${pt(m, a + w * 1.7)} ${pt(r1, a + w)}`;
});
const circle = (r) => `M${-r} 0 a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0`;
const PATHS = [circle(124), circle(112), ...ring(24, 86, 120, 0.09), ...ring(16, 42, 100, 0.15, 0.1), ...ring(8, 14, 76, 0.27, Math.PI / 8), ...ring(8, 12, 52, 0.32), circle(12), circle(5)];

function Clock({ city, tz, h, m }) {
  const hh = (h % 12) * 30 + m * 0.5, mm = m * 6, pad = (n) => String(n).padStart(2, "0");
  return (
    <div className="clk">
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="46" fill="#3d0710" stroke="#f0d28a" strokeWidth="3" />
        {Array.from({ length: 12 }, (_, i) => <line key={i} x1="50" y1="9" x2="50" y2={i % 3 ? 13 : 16} stroke="#f0d28a" strokeWidth="2" transform={`rotate(${i * 30} 50 50)`} />)}
        <line className="hand" x1="50" y1="50" x2="50" y2="29" strokeWidth="4" style={{ "--a0": hh - 360 + "deg", "--a1": hh + "deg" }} />
        <line className="hand" x1="50" y1="50" x2="50" y2="17" strokeWidth="2.5" style={{ "--a0": mm - 720 + "deg", "--a1": mm + "deg" }} />
        <circle cx="50" cy="50" r="3.5" fill="#f0d28a" />
      </svg>
      <b>{pad(h)}:{pad(m)}</b><span>{city} · {tz}</span>
    </div>
  );
}

function Intro({ open, onOpen }) {
  useEffect(() => { const t = setTimeout(onOpen, 15000); return () => clearTimeout(t); }, [onOpen]);
  return (
    <div className={"intro" + (open ? " gone" : "")} style={{ "--bg": `url(${introImg})` }}>
      <p className="ml gold">ഓം ശ്രീ ഗണേശായ നമഃ</p>
      {/* Scene 1 — two time zones, one thread, one muhurtham (10:30 IST = 06:00 CET) */}
      <div className="scene1">
        <Clock city="GERMANY" tz="CET" h={6} m={0} />
        <div className="threadbox">
          <svg viewBox="0 0 40 100" className="thread"><path d="M20 0 C2 25 38 50 20 100" pathLength="1" /></svg>
          <span className="hrt">❤</span>
        </div>
        <Clock city="KERALA" tz="IST" h={10} m={30} />
        <p className="cap ml">Across the oceans, together in the same moment</p>
        <p className="cap en it">10:30 AM in Kerala is 6:00 AM in Germany — time zones apart, one muhurtham.</p>
      </div>
      <div className="after">
        <h2>Shubha Vivaham</h2>
        <svg viewBox="-130 -130 260 260" className="draw">
          <g className="spin">{PATHS.map((d, i) => <path key={i} d={d} pathLength="1" style={{ animationDelay: 6 + i * 0.09 + "s" }} />)}</g>
        </svg>
        <p className="mono">19 · 12 · 2026</p>
      </div>
      <button className="pill light" onClick={onOpen}>Open invitation</button>
    </div>
  );
}

function Reveal({ children }) {
  const r = useRef(), [v, setV] = useState(false);
  useEffect(() => { const o = new IntersectionObserver(([e]) => e.isIntersecting && setV(true), { threshold: 0.12 }); o.observe(r.current); return () => o.disconnect(); }, []);
  return <div ref={r} className={"rv" + (v ? " in" : "")}>{children}</div>;
}

function Countdown() {
  const [n, setN] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setN(Date.now()), 1000); return () => clearInterval(t); }, []);
  const s = Math.max(0, Math.floor((new Date(D.when) - n) / 1000));
  const v = [s / 86400, (s % 86400) / 3600, (s % 3600) / 60, s % 60].map(Math.floor);
  return <div className="cd">{["Days", "Hours", "Min", "Sec"].map((l, i) => <div key={l}><b>{v[i]}</b><span>{l}</span></div>)}</div>;
}

function addToCalendar() {
  const f = (d) => new Date(d).toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
  const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "BEGIN:VEVENT", "SUMMARY:Megha & Vineeth Wedding", "DTSTART:" + f(D.when), "DTEND:" + f(D.endsAt),
    "LOCATION:" + D.temple.en, "DESCRIPTION:Reception: " + D.hall.map, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  a.download = "wedding.ics"; a.click();
}

function Figure({ who, color }) {
  const skin = "#e8b894", line = "#4a0a12";
  return who === "bride" ? (
    <svg viewBox="0 0 120 250" className="fig">
      <path d="M44 24 Q60 6 76 24 L74 40 H46Z M70 30 Q92 90 84 150" fill="#2a1410" stroke="#2a1410" strokeWidth="6" />
      <circle cx="60" cy="34" r="16" fill={skin} stroke={line} />
      <path d="M42 56 H78 L94 240 H26Z" fill={color} stroke={line} strokeWidth="1.5" />
      <path d="M78 56 L94 240 M26 240 H94" stroke="#c9973a" strokeWidth="6" fill="none" />
      <path d="M42 56 L72 66 L48 150Z" fill="#c9973a" opacity=".55" />
    </svg>
  ) : (
    <svg viewBox="0 0 120 250" className="fig">
      <circle cx="60" cy="32" r="16" fill={skin} stroke={line} />
      <path d="M44 26 Q60 8 76 26 Q60 18 44 26Z" fill="#2a1410" />
      <rect x="38" y="54" width="44" height="88" rx="6" fill={color} stroke={line} strokeWidth="1.5" />
      <path d="M38 142 H82 L88 240 H32Z" fill="#fff8e8" stroke={line} strokeWidth="1.5" />
      <path d="M32 232 H88" stroke="#c9973a" strokeWidth="5" />
    </svg>
  );
}

export default function App() {
  const [open, setOpen] = useState(false);
  const [who, setWho] = useState("bride");
  const [col, setCol] = useState({ bride: D.dress.bride[0], groom: D.dress.groom[0] });
  const wa = "https://wa.me/?text=" + encodeURIComponent("മേഘ & വിനീത് — Wedding on 19 Dec 2026 🪷 " + location.href);
  return (
    <>
      <Intro open={open} onOpen={() => setOpen(true)} />
      <main className={"page" + (open ? " show" : "")}>
        <section className="hero" style={{ "--full": `url(${artFull})`, "--top": `url(${artTop})`, "--bot": `url(${artBot})` }}>
          <Reveal>
            <p className="ml">ഓം ശ്രീ ഗണേശായ നമഃ</p>
            <h1 className="ml">മംഗല്യക്ഷണം</h1>
            <p className="en it">With the blessings of the Almighty, we invite you and your family to the wedding of</p>
            <div className="script">{D.bride.name}<small>&amp;</small>{D.groom.name}</div>
            {/* <p className="ml">{D.bride.ml} &nbsp;❖&nbsp; {D.groom.ml}</p> */}
            <div className="two">
              <p><b>Bride</b><br />D/o {D.bride.parents}<br /><span>{D.bride.addr}</span></p>
              <p><b>Groom</b><br />S/o {D.groom.parents}<br /><span>{D.groom.addr}</span></p>
            </div>
          </Reveal>
        </section>

        <section className="block">
          <Reveal>
            <p className="mono">SATURDAY · MUHURTHAM 10:30 – 11:30 AM</p>
            <div className="date"><b>19</b><span>DECEMBER<br />2026</span></div>
            <Countdown />
            <h3 className="ml">താലികെട്ട്</h3>
            <p className="ml">{D.temple.ml}</p>
            {/* <p className="en it">{D.temple.en}</p> */}
            <h3 className="ml">{D.hall.ml}</h3>
            {/* <p className="en it">{D.hall.en}</p> */}
            <div className="btns">
              <a className="pill" href={D.hall.map} target="_blank" rel="noreferrer">Open in Maps</a>
              <button className="pill ghost" onClick={addToCalendar}>Add to calendar</button>
              <a className="pill ghost" href={wa} target="_blank" rel="noreferrer">Share on WhatsApp</a>
            </div>
          </Reveal>
        </section>

        <section className="block">
          <Reveal>
            <p className="mono">DRESS CODE · TRADITIONAL KERALA</p>
            <p className="en it">Match each other or mix it up — pick a shade</p>
            <div className="toggle">{["bride", "groom"].map((k) => <button key={k} className={who === k ? "on" : ""} onClick={() => setWho(k)}>{k === "bride" ? "Her" : "Him"}</button>)}</div>
            <Figure who={who} color={col[who]} />
            <div className="sw">{D.dress[who].map((c) => <button key={c} aria-label={c} style={{ background: c }} className={col[who] === c ? "on" : ""} onClick={() => setCol({ ...col, [who]: c })} />)}</div>
          </Reveal>
        </section>

        <section className="block love">
          <Reveal>
            <p className="script sm">With love,</p>
            <p className="fam-line">The families of Megha &amp; Vineeth</p>
            {/* <div className="two">{D.family.map((n) => <p key={n}>{n}</p>)}</div> */}
            <p className="ml">🪷 ശുഭം 🪷</p>
          </Reveal>
        </section>
      </main>
    </>
  );
}
