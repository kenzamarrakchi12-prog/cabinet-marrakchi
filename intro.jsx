/* Intro overlay — architectural plan build-up */

const { useState: useStateI, useEffect: useEffectI } = React;

function Intro({ onDone }) {
  const [phase, setPhase] = useStateI(0); // 0 drawing plan, 1 name reveal, 2 fade, 3 done

  useEffectI(() => {
    const t1 = setTimeout(() => setPhase(1), 2400); // plan drawn, name appears
    const t2 = setTimeout(() => setPhase(2), 4000); // start fade
    const t3 = setTimeout(() => { setPhase(3); onDone && onDone(); }, 4700);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  if (phase === 3) return null;

  return (
    <div className={`intro ${phase >= 2 ? "fade" : ""} ${phase >= 1 ? "named" : ""}`}>
      <div className="intro__corner">
        <span>Plan N° 001</span>
        <span className="intro__dot">✦</span>
        <span>1998 — 2026</span>
      </div>

      <svg className="intro__plan" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid meet">
        {/* Grid */}
        <g className="intro__grid" stroke="currentColor" strokeWidth="0.4" opacity="0.25">
          {Array.from({ length: 17 }).map((_, i) => (
            <line key={"v" + i} x1={i * 50} y1="0" x2={i * 50} y2="500" />
          ))}
          {Array.from({ length: 11 }).map((_, i) => (
            <line key={"h" + i} x1="0" y1={i * 50} x2="800" y2={i * 50} />
          ))}
        </g>

        {/* Exterior walls */}
        <g fill="none" stroke="currentColor" strokeWidth="1.6" className="intro__draw">
          <path d="M 140 120 L 660 120 L 660 380 L 140 380 Z" style={{ "--len": 1560, "--d": "0ms" }} />
        </g>

        {/* Interior partitions */}
        <g fill="none" stroke="currentColor" strokeWidth="1" className="intro__draw">
          <line x1="340" y1="120" x2="340" y2="260" style={{ "--len": 140, "--d": "400ms" }} />
          <line x1="140" y1="260" x2="520" y2="260" style={{ "--len": 380, "--d": "600ms" }} />
          <line x1="520" y1="260" x2="520" y2="380" style={{ "--len": 120, "--d": "900ms" }} />
          <line x1="440" y1="120" x2="440" y2="200" style={{ "--len": 80, "--d": "1100ms" }} />
          <line x1="440" y1="200" x2="660" y2="200" style={{ "--len": 220, "--d": "1300ms" }} />
        </g>

        {/* Openings (gaps as small lines indicating doors) */}
        <g fill="none" stroke="currentColor" strokeWidth="0.8" className="intro__draw" opacity="0.6">
          <path d="M 240 260 A 30 30 0 0 1 270 290" style={{ "--len": 50, "--d": "1500ms" }} />
          <path d="M 400 120 A 25 25 0 0 1 425 145" style={{ "--len": 40, "--d": "1600ms" }} />
        </g>

        {/* Staircase */}
        <g fill="none" stroke="currentColor" strokeWidth="0.7" className="intro__draw" opacity="0.7">
          <line x1="560" y1="310" x2="640" y2="310" style={{ "--len": 80, "--d": "1700ms" }} />
          <line x1="560" y1="322" x2="640" y2="322" style={{ "--len": 80, "--d": "1750ms" }} />
          <line x1="560" y1="334" x2="640" y2="334" style={{ "--len": 80, "--d": "1800ms" }} />
          <line x1="560" y1="346" x2="640" y2="346" style={{ "--len": 80, "--d": "1850ms" }} />
          <line x1="560" y1="358" x2="640" y2="358" style={{ "--len": 80, "--d": "1900ms" }} />
        </g>

        {/* Dimensions */}
        <g fill="currentColor" className="intro__dim" opacity="0.5" fontFamily="JetBrains Mono, monospace" fontSize="8" letterSpacing="2">
          <text x="400" y="108" textAnchor="middle">10.40 M</text>
          <text x="672" y="252" transform="rotate(90 672 252)" textAnchor="middle">5.20 M</text>
        </g>

        {/* Corner ticks */}
        <g stroke="currentColor" strokeWidth="0.8" className="intro__ticks" opacity="0.6">
          <path d="M 125 120 L 140 120 M 140 105 L 140 120" />
          <path d="M 675 120 L 660 120 M 660 105 L 660 120" />
          <path d="M 125 380 L 140 380 M 140 395 L 140 380" />
          <path d="M 675 380 L 660 380 M 660 395 L 660 380" />
        </g>
      </svg>

      <div className="intro__name">
        <div className="intro__name-eyebrow">Architecte D.P.L.G. — Tanger, Maroc</div>
        <h1 className="intro__name-title">
          <span className="intro__word">MK</span>
          <span className="intro__word intro__word--it">Architects</span>
        </h1>
        <div className="intro__name-sub">Cabinet d&rsquo;architecture · Fondé en 1998</div>
      </div>

      <div className="intro__meta">
        <div className="intro__line intro__line--l">
          <span>Échelle 1:100</span>
          <span>10.40 × 5.20 M</span>
        </div>
        <div className="intro__line intro__line--r">
          <span>Détroit de Gibraltar</span>
          <span>35°46&prime;N</span>
        </div>
      </div>

      <div className="intro__progress">
        <div className="intro__progress-bar"></div>
      </div>
    </div>
  );
}

Object.assign(window, { Intro });
