/* ============================================================
   MK ARCHITECTS — Section Architecture d'Intérieur
   Page complète, éditoriale et interactive
   ============================================================ */

const { useState: useStateInt, useEffect: useEffectInt, useRef: useRefInt } = React;

/* Tab → project ids */
const INT_TABS = [
  { key: "residence", ids: ["i1", "i2"], stat: "06+",  stat_l_key: "tab_stat_residence" },
  { key: "suite",     ids: ["i3"],        stat: "100%", stat_l_key: "tab_stat_suite" },
  { key: "salon",     ids: ["i4"],        stat: "12+",  stat_l_key: "tab_stat_salon" },
];

function InteriorSection({ t, projects, lang }) {
  const [activeTab, setActiveTab] = useStateInt(0);
  const [imgFade, setImgFade]     = useStateInt(false);
  const ref = useRefInt(null);
  const tI = t.interior;
  if (!tI) return null;

  const interiorProjects = projects.filter(p => p.mode === "interior");
  const tab = INT_TABS[activeTab];
  const tabProjects = interiorProjects.filter(p => tab.ids.includes(p.id));
  const featured = tabProjects[0];

  const switchTab = (i) => {
    setImgFade(true);
    setTimeout(() => { setActiveTab(i); setImgFade(false); }, 220);
  };

  return (
    <section className="int-sec" id="interieur-studio" ref={ref} data-screen-label="Architecture d'intérieur">

      {/* ── INTRO SPLIT ── */}
      <div className="int-intro">
        <div className="container int-intro__inner">
          <div className="int-intro__left">
            <div className="eyebrow" style={{ color: "var(--accent)" }}>{tI.eyebrow}</div>
            <h2 className="int-intro__title">
              {tI.title_1}<br/><i className="it">{tI.title_2}</i>
            </h2>
            <p className="int-intro__desc">{tI.desc}</p>
            <div className="int-intro__kpis">
              {tI.kpis.map((k, i) => (
                <div key={i} className="int-kpi">
                  <div className="int-kpi__n">{k.n}</div>
                  <div className="int-kpi__l">{k.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="int-intro__right">
            <div className="int-intro__grid">
              {interiorProjects.slice(0, 4).map((p, i) => (
                <div key={p.id} className={`int-intro__thumb int-intro__thumb--${i}`}>
                  <img src={p.img} alt={p.title} />
                  {i === 0 && (
                    <div className="int-intro__badge">
                      <span className="int-intro__badge-n">12</span>
                      <span className="int-intro__badge-l">{tI.badge_label}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── STICKY TAB BAR ── */}
      <div className="int-tabs-bar">
        <div className="container int-tabs-inner">
          {tI.tabs.map((label, i) => (
            <button
              key={i}
              className={`int-tab${activeTab === i ? " active" : ""}`}
              onClick={() => switchTab(i)}
            >
              <span className="int-tab__num">0{i + 1}</span>
              <span className="int-tab__label">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── FEATURED PROJECT ── */}
      {featured && (
        <div className={`int-feat container${imgFade ? " is-fading" : ""}`}>
          <div className="int-feat__img">
            <img src={featured.img} alt={featured.title} />
            <div className="int-feat__loc-badge">
              <span>{featured.location}</span>
              <span className="sep">·</span>
              <span>{featured.surface}</span>
            </div>
          </div>

          <div className="int-feat__body">
            <div className="int-feat__eyebrow">{featured.type}</div>
            <h3 className="int-feat__title">
              {featured.title.split(" ").slice(0,-1).join(" ")}{" "}
              <i className="it">{featured.title.split(" ").slice(-1)[0]}</i>
            </h3>
            <div className="int-feat__meta">
              {[
                [tI.lbl_location, featured.location],
                [tI.lbl_surface,  featured.surface],
                [tI.lbl_year,     featured.year],
              ].map(([k, v]) => (
                <div key={k} className="int-feat__meta-row">
                  <span className="int-feat__meta-k">{k}</span>
                  <span className="int-feat__meta-v">{v}</span>
                </div>
              ))}
            </div>
            <div className="int-feat__tags">
              {featured.tags.map(tg => (
                <span key={tg} className="int-feat__tag">{tg}</span>
              ))}
            </div>
            <div className="int-feat__accent-stat">
              <div className="int-feat__stat-n">{tab.stat}</div>
              <div className="int-feat__stat-l">{tI[tab.stat_l_key]}</div>
            </div>
          </div>
        </div>
      )}

      {/* ── PROCESS ── */}
      <div className="int-process">
        <div className="container int-process__inner">
          <div className="int-process__head">
            <h3 className="int-process__title">
              {tI.process_title}<br/>
              <i className="it">{tI.process_title2}</i>
            </h3>
            <p className="int-process__sub">{tI.process_sub}</p>
          </div>
          <div className="int-process__steps">
            {tI.process.map((step, i) => (
              <div key={i} className="int-step">
                <div className="int-step__num">{step.n}</div>
                <div className="int-step__icon">{step.icon}</div>
                <div className="int-step__title">{step.title}</div>
                <div className="int-step__desc">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MATERIALS STRIP ── */}
      <div className="int-materials">
        <div className="container int-materials__inner">
          <div className="int-mat__label">{tI.mat_label}</div>
          <div className="int-mat__chips">
            {tI.materials.map((m, i) => (
              <div key={i} className="int-mat__chip">
                <div className="int-mat__chip-dot" style={{ background: m.color }}></div>
                <span>{m.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA STRIP ── */}
      <div className="int-cta-strip">
        <div className="container int-cta__inner">
          <div className="int-cta__text">
            <span>{tI.cta_label}</span>
          </div>
          <a href="#rdv" className="int-cta__btn">{tI.cta} ↗</a>
        </div>
      </div>

    </section>
  );
}

Object.assign(window, { InteriorSection });
