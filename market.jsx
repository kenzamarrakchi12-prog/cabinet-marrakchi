/* ============================================================
   CABINET MARRAKCHI — MarketSection + MRESection + SVG charts
   ============================================================ */

const { useState: useStateMK, useEffect: useEffectMK, useRef: useRefMK } = React;

/* ── Real market data (ANCFCC · Bank Al-Maghrib) ── */
const PRICE_DATA = [
  { year: "2018", val: 8200 },
  { year: "2019", val: 8700 },
  { year: "2020", val: 8500 },
  { year: "2021", val: 9400 },
  { year: "2022", val: 10800 },
  { year: "2023", val: 12100 },
  { year: "2024e",val: 13400 },
];

const MRE_DATA = [
  { year: "2019", val: 66.0 },
  { year: "2020", val: 64.7 },
  { year: "2021", val: 93.6 },
  { year: "2022", val: 110.7 },
  { year: "2023", val: 115.3 },
];

/* ── Animated line chart — price evolution ── */
function LineChart({ data }) {
  const [animated, setAnimated] = useStateMK(false);
  const [pathLen, setPathLen]   = useStateMK(700);
  const rootRef = useRefMK(null);
  const pathRef = useRefMK(null);

  useEffectMK(() => {
    if (pathRef.current) setPathLen(pathRef.current.getTotalLength() || 700);
  }, []);

  useEffectMK(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setAnimated(true); io.disconnect(); }
    }, { threshold: 0.2 });
    if (rootRef.current) io.observe(rootRef.current);
    return () => io.disconnect();
  }, []);

  const W = 520, H = 230;
  const pad = { t: 24, r: 64, b: 44, l: 58 };
  const cW = W - pad.l - pad.r;
  const cH = H - pad.t - pad.b;

  const minV = Math.min(...data.map(d => d.val)) - 900;
  const maxV = Math.max(...data.map(d => d.val)) + 800;
  const px = (i) => pad.l + (i / (data.length - 1)) * cW;
  const py = (v) => pad.t + cH - ((v - minV) / (maxV - minV)) * cH;

  const linePath = data.map((d, i) => `${i === 0 ? "M" : "L"}${px(i).toFixed(1)},${py(d.val).toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L${px(data.length-1).toFixed(1)},${(pad.t+cH).toFixed(1)} L${px(0).toFixed(1)},${(pad.t+cH).toFixed(1)} Z`;

  const yTicks = [9000, 10000, 11000, 12000, 13000];

  return (
    <div ref={rootRef}>
      <svg viewBox={`0 0 ${W} ${H}`} className="chart-svg">
        <defs>
          <linearGradient id="lgArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.20"/>
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.02"/>
          </linearGradient>
        </defs>

        {/* Y grid + labels */}
        {yTicks.map((v) => (
          <g key={v}>
            <line x1={pad.l} y1={py(v)} x2={W-pad.r} y2={py(v)}
              stroke="var(--line)" strokeWidth="1" strokeDasharray="3 4"/>
            <text x={pad.l - 7} y={py(v) + 4}
              textAnchor="end" fontSize="9.5" fontFamily="var(--f-mono)" fill="var(--ink-mute)">
              {(v/1000).toFixed(0)}k
            </text>
          </g>
        ))}

        {/* Area */}
        <path d={areaPath} fill="url(#lgArea)"
          style={{ opacity: animated ? 1 : 0, transition: "opacity 1000ms 300ms" }}/>

        {/* Line */}
        <path ref={pathRef} d={linePath} fill="none"
          stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray={pathLen}
          style={{
            strokeDashoffset: animated ? 0 : pathLen,
            transition: "stroke-dashoffset 1800ms cubic-bezier(0.22,1,0.36,1)"
          }}/>

        {/* Dots + labels */}
        {data.map((d, i) => (
          <g key={i}>
            {/* X label */}
            <text x={px(i)} y={H - 6} textAnchor="middle"
              fontSize="9.5" fontFamily="var(--f-mono)" fill="var(--ink-mute)">{d.year}</text>
            {/* Dot */}
            <circle cx={px(i)} cy={py(d.val)} r="4.5"
              fill="var(--bg)" stroke="var(--accent)" strokeWidth="2"
              style={{ opacity: animated ? 1 : 0, transition: `opacity 250ms ${200 + i * 130}ms` }}/>
            {/* Last value label — ancré à droite du chart pour ne pas déborder */}
            {i === data.length - 1 && (
              <text x={W - pad.r} y={py(d.val) - 10}
                textAnchor="end"
                fontSize="11" fontFamily="var(--f-mono)" fontWeight="600" fill="var(--accent)"
                style={{ opacity: animated ? 1 : 0, transition: "opacity 400ms 1400ms" }}>
                {(d.val/1000).toFixed(1)}k MAD/m²
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ── Animated bar chart — MRE transfers ── */
function BarChart({ data }) {
  const [animated, setAnimated] = useStateMK(false);
  const rootRef = useRefMK(null);

  useEffectMK(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setAnimated(true); io.disconnect(); }
    }, { threshold: 0.2 });
    if (rootRef.current) io.observe(rootRef.current);
    return () => io.disconnect();
  }, []);

  const W = 440, H = 230;
  const pad = { t: 24, r: 20, b: 44, l: 48 };
  const cW = W - pad.l - pad.r;
  const cH = H - pad.t - pad.b;
  const maxV = 130;
  const slot = cW / data.length;
  const bW   = slot * 0.52;

  return (
    <div ref={rootRef}>
      <svg viewBox={`0 0 ${W} ${H}`} className="chart-svg">
        <defs>
          <linearGradient id="lgBarHi" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="1"/>
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.55"/>
          </linearGradient>
        </defs>

        {/* Y grid */}
        {[0, 50, 100].map((v) => {
          const yv = pad.t + cH * (1 - v / maxV);
          return (
            <g key={v}>
              <line x1={pad.l} y1={yv} x2={W-pad.r} y2={yv}
                stroke="var(--line)" strokeWidth="1" strokeDasharray="3 4"/>
              <text x={pad.l - 6} y={yv + 4}
                textAnchor="end" fontSize="9.5" fontFamily="var(--f-mono)" fill="var(--ink-mute)">{v}</text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((d, i) => {
          const bH = (d.val / maxV) * cH;
          const bX = pad.l + i * slot + (slot - bW) / 2;
          const isLast = i === data.length - 1;
          const animH = animated ? bH : 0;
          return (
            <g key={i}>
              <rect x={bX} y={pad.t + cH - animH} width={bW} height={animH}
                fill={isLast ? "url(#lgBarHi)" : "var(--accent-dim)"} rx="2"
                style={{ transition: `y ${600+i*80}ms ${i*70}ms var(--ease), height ${600+i*80}ms ${i*70}ms var(--ease)` }}/>
              {/* Top cap for last bar */}
              {isLast && (
                <rect x={bX} y={pad.t + cH - animH} width={bW} height="2.5"
                  fill="var(--accent)" rx="1"
                  style={{ transition: `y ${600+i*80}ms ${i*70}ms var(--ease)` }}/>
              )}
              {/* X label */}
              <text x={bX + bW/2} y={H - 6} textAnchor="middle"
                fontSize="9.5" fontFamily="var(--f-mono)" fill="var(--ink-mute)">{d.year}</text>
              {/* Value label */}
              <text x={bX + bW/2} y={pad.t + cH - animH - 7} textAnchor="middle"
                fontSize="9.5" fontFamily="var(--f-mono)" fill={isLast ? "var(--ink)" : "var(--ink-dim)"}
                style={{ opacity: animated ? 1 : 0, transition: `opacity 300ms ${i*70 + 500}ms` }}>
                {d.val.toFixed(1)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ── Market section ── */
function MarketSection({ t }) {
  const ref = useReveal();
  const tm = t.market;
  return (
    <section className="market container" ref={ref} id="investir" data-screen-label="Marché immobilier tangerois">
      <div className="market__head">
        <div className="market__head-left">
          <div className="eyebrow reveal">{tm.eyebrow}</div>
          <h2 className="market__title reveal">
            {tm.title_1}<br/><i className="it">{tm.title_2}</i>
          </h2>
        </div>
        <div className="market__head-right">
          <p className="market__intro reveal">{tm.desc}</p>
          <div className="market__head-rule reveal"></div>
        </div>
      </div>

      {/* Key stats pills */}
      <div className="market__pills reveal">
        {tm.highlights.map((h, i) => (
          <div key={i} className="market__pill">
            <div className="market__pill-n">{h.n}</div>
            <div className="market__pill-l">{h.label}</div>
          </div>
        ))}
      </div>

      {/* Competitive insight — two-column editorial block */}
      {tm.insight_bullets && (
        <div className="market__insight reveal">
          {/* Left: display title */}
          <div className="market__insight-left">
            <h3 className="market__insight-title">
              {tm.insight_title}<br/>
              <i className="it">{tm.insight_title2}</i>
            </h3>
          </div>
          {/* Right: bullet rows */}
          <div className="market__insight-right">
            {tm.insight_bullets.map((b, i) => (
              <div key={i} className="market__insight-row">
                <div className="market__insight-stat">{b.stat}</div>
                <div className="market__insight-text">{b.text}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="market__charts">
        <div className="market__chart-card reveal">
          <div className="chart-head">
            <div className="chart-title">{tm.chart1_title}</div>
            <div className="chart-sub">{tm.chart1_sub}</div>
          </div>
          <LineChart data={PRICE_DATA} />
          <div className="chart-source">{tm.chart1_source}</div>
        </div>

        <div className="market__chart-card reveal">
          <div className="chart-head">
            <div className="chart-title">{tm.chart2_title}</div>
            <div className="chart-sub">{tm.chart2_sub}</div>
          </div>
          <BarChart data={MRE_DATA} />
          <div className="chart-source">{tm.chart2_source}</div>
        </div>
      </div>

      <div className="market__sources reveal">{tm.sources}</div>
    </section>
  );
}

/* ── MRE section ── */
function MRESection({ t }) {
  const ref = useReveal();
  const tm = t.mre;
  return (
    <section className="mre-section" ref={ref} id="mre" data-screen-label="MRE — Marocains du Monde">
      {/* Big watermark background text */}
      <div className="mre__bg-word" aria-hidden="true">MRE</div>

      <div className="container mre__inner">
        {/* ── Left column: pitch ── */}
        <div className="mre__left">
          <div className="eyebrow reveal" style={{ color: "var(--accent)" }}>{tm.eyebrow}</div>
          <h2 className="mre__title reveal">
            {tm.title_1}<br/><i className="it">{tm.title_2}</i>
          </h2>
          <p className="mre__desc reveal">{tm.desc}</p>

          {/* Three key stats */}
          <div className="mre__stats reveal">
            <div className="mre__stat">
              <div className="mre__stat-n">{tm.stat1_n}</div>
              <div className="mre__stat-l">{tm.stat1_l}</div>
            </div>
            <div className="mre__stat">
              <div className="mre__stat-n">{tm.stat2_n}</div>
              <div className="mre__stat-l">{tm.stat2_l}</div>
            </div>
            <div className="mre__stat">
              <div className="mre__stat-n">{tm.stat3_n}</div>
              <div className="mre__stat-l">{tm.stat3_l}</div>
            </div>
          </div>

          <a href="#rdv" className="mre__cta-btn reveal">{tm.cta} ↗</a>
        </div>

        {/* ── Right column: service cards ── */}
        <div className="mre__right">
          {tm.cards.map((c, i) => (
            <div key={i} className="mre__card reveal">
              <div className="mre__card-num">{c.num}</div>
              <div className="mre__card-body">
                <div className="mre__card-title">{c.title}</div>
                <div className="mre__card-desc">{c.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { MarketSection, MRESection });
