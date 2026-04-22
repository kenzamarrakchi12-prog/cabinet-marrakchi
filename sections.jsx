/* Sections: Nav, Hero, Split toggle, Manifesto, Stats, Strip, Timeline, Ticker, Footer */

const { useState, useEffect, useRef, useMemo } = React;

/* ---------- Helpers ---------- */

/* Colorise "MK" en bleu roi partout où c'est du texte rendu */
function renderMK(text) {
  if (!text || typeof text !== "string") return text;
  const parts = text.split("MK");
  if (parts.length === 1) return text;
  return parts.reduce((acc, part, i) => {
    if (i === 0) return [part];
    return [...acc, <span key={i} className="mk-blue">MK</span>, part];
  }, []);
}

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    el.querySelectorAll(".reveal").forEach((n, i) => {
      n.style.setProperty("--i", i);
      io.observe(n);
    });
    return () => io.disconnect();
  }, []);
  return ref;
}

/* ---------- Navigation ---------- */
function Nav({ t, lang, setLang, theme, onRdv }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav className={`nav${scrolled ? " scrolled" : ""}`}>
      <div className="nav__brand">
        <span className="dot"></span>
        <span><span className="mk-blue">MK</span> Architects</span>
        <span className="nav__brand-city" style={{ opacity: 0.55 }}>— Tanger</span>
      </div>
      <div className="nav__links">
        <a href="#projets">{t.nav.work}</a>
        <a href="#expertises">{t.nav.expertises}</a>
        <a href="#investir">{t.nav.investir}</a>
        <a href="#mre">{t.nav.mre}</a>
        <a href="#agence">{t.nav.about}</a>
      </div>
      <div className="nav__right">
        <div className="nav__lang">
          <button className={lang === "fr" ? "active" : ""} onClick={() => setLang("fr")}>FR</button>
          <span className="sep">/</span>
          <button className={lang === "ar" ? "active" : ""} onClick={() => setLang("ar")}>عربية</button>
          <span className="sep">/</span>
          <button className={lang === "dr" ? "active" : ""} onClick={() => setLang("dr")}>Darija</button>
        </div>
        <button className="nav__cta" onClick={onRdv}>{t.nav.rdv} ↗</button>
      </div>
    </nav>
  );
}

/* ---------- Hero ---------- */
function HeroCinematic({ t, images, heroStyle }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % images.length), 6500);
    return () => clearInterval(id);
  }, [images.length]);

  if (heroStyle === "split") {
    return (
      <section className="hero hero--split">
        <div className="hero__media">
          <div className="hero__half">
            <div className="hero__half-img">
              <img src="photos/villa-contemporaine-piscine.jpg" alt="" />
            </div>
            <div className="hero__half-label">
              <div className="hero__half-title">{t.split.archi}</div>
              <div className="hero__half-num">
                <span>01 — Résidentiel</span>
                <span>Villa · Tanger</span>
              </div>
            </div>
          </div>
          <div className="hero__half">
            <div className="hero__half-img">
              <img src="photos/interieur-double-hauteur.jpg" alt="" />
            </div>
            <div className="hero__half-label">
              <div className="hero__half-title">{t.split.interior}</div>
              <div className="hero__half-num">
                <span>02 — Sur mesure</span>
                <span>Duplex · M’diq</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (heroStyle === "type") {
    return (
      <section className="hero hero--type">
        <div className="hero__big">
          <span><span className="mk-blue">MK</span> Architects</span>
        </div>
        <div className="hero__content">
          <div className="hero__meta">
            <h1 className="hero__title" style={{ maxWidth: "none" }}>
              <span className="ln"><span>{t.hero.title_l1}</span></span>
            </h1>
            <div className="hero__sub">{t.hero.sub}</div>
          </div>
        </div>
      </section>
    );
  }

  // Default: editorial mosaic (left text panel + right photo grid)
  return (
    <section className="hero hero--editorial">
      {/* ── Left: text panel ── */}
      <div className="hero__panel">
        <div className="hero__panel-inner">
          <div className="hero__ed-eyebrow">{t.hero.eyebrow}</div>
          <h1 className="hero__title">
            <span className="ln"><span>{t.hero.title_l1}</span></span>
            <span className="ln"><span>{t.hero.title_l2}</span></span>
            <span className="ln"><span>{t.hero.title_l3} <i className="it mk-blue">{t.hero.title_l4}</i></span></span>
          </h1>
          <div className="hero__sub">{t.hero.sub}</div>
        </div>
        <div className="hero__panel-foot">
          <div className="hero__scroll-hint">{t.hero.scroll}</div>
          <div className="hero__dots">
            {images.map((_, i) => (
              <span key={i} className={`hero__dot ${i === idx ? "active" : ""}`}></span>
            ))}
          </div>
          <div className="hero__counter-ed">
            {t.hero.counter(idx + 1, images.length)}
          </div>
        </div>
      </div>

      {/* ── Right: photo mosaic ── */}
      <div className="hero__mosaic">
        {/* Tall main photo — left column, full height */}
        <div className="hero__mosaic-main">
          {images.map((src, i) => (
            <img key={src} src={src} alt="" className={`hero__mimg ${i === idx ? "active" : ""}`} />
          ))}
        </div>
        {/* Top-right photo */}
        <div className="hero__mosaic-top">
          {images.map((src, i) => (
            <img key={src} src={src} alt="" className={`hero__mimg ${i === (idx + 1) % images.length ? "active" : ""}`} />
          ))}
        </div>
        {/* Bottom-right photo */}
        <div className="hero__mosaic-bot">
          {images.map((src, i) => (
            <img key={src} src={src} alt="" className={`hero__mimg ${i === (idx + 2) % images.length ? "active" : ""}`} />
          ))}
          {/* Accent label bottom-right */}
          <div className="hero__mosaic-label">
            <span>Tanger · Maroc</span>
            <span className="hero__mosaic-label-dot">✦</span>
            <span>Est. 1998</span>
          </div>
        </div>
        <div className="hero__grain"></div>
      </div>
    </section>
  );
}

/* ---------- Split toggle ---------- */
function SplitToggle({ t, mode, setMode }) {
  return (
    <div className="split__bar" id="projets" data-screen-label="Split Archi / Intérieur">
      <button
        className="split__side"
        data-active={mode === "archi"}
        onClick={() => setMode("archi")}
      >
        <span className="num">{t.split.num_archi}</span>
        <span className="label">{t.split.archi}</span>
        <span className="arrow">{mode === "archi" ? "●" : "○"}</span>
      </button>
      <button
        className="split__side"
        data-active={mode === "interior"}
        onClick={() => setMode("interior")}
        id="interieur"
      >
        <span className="num">{t.split.num_int}</span>
        <span className="label">{t.split.interior}</span>
        <span className="arrow">{mode === "interior" ? "●" : "○"}</span>
      </button>
    </div>
  );
}

/* ---------- Manifesto ---------- */
function Manifesto({ t }) {
  const ref = useReveal();
  return (
    <section className="manifesto container" id="agence" ref={ref} data-screen-label="Manifeste">
      <div className="manifesto__grid">
        <div className="manifesto__eyebrow reveal">
          <div className="eyebrow">{t.manifesto.eyebrow}</div>
        </div>
        <div className="manifesto__body">
          <p className="reveal">{t.manifesto.p1}</p>
          <p className="reveal">{t.manifesto.p2}</p>
          <p className="reveal">{t.manifesto.p3}</p>
          <div className="manifesto__sig reveal">{renderMK(t.manifesto.sig)}</div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Animated counter ---------- */
function Counter({ target, duration = 1800 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const start = performance.now();
          const step = (t) => {
            const p = Math.min(1, (t - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(Math.round(target * eased));
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [target, duration]);
  return <span ref={ref}>{val.toLocaleString("fr-FR")}</span>;
}

function Stats({ t }) {
  const ref = useReveal();
  return (
    <section className="stats container" ref={ref} data-screen-label="Chiffres">
      <div className="strip__head">
        <div className="eyebrow reveal">En chiffres</div>
      </div>
      <div className="stats__grid">
        {t.stats.map((s, i) => (
          <div key={i} className="stat reveal">
            <div className="stat__num">
              <Counter target={s.n} />
              <span className="unit">{s.suffix}</span>
            </div>
            <div className="stat__label">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- Featured projects strip ---------- */
function ProjectStrip({ t, projects, onOpen }) {
  const ref = useReveal();
  const featured = projects.slice(0, 4);
  return (
    <section className="strip container" ref={ref} data-screen-label="Projets récents">
      <div className="strip__head">
        <h2 className="reveal">
          {t.strip.title_1} <i className="it">{t.strip.title_2}</i>
        </h2>
        <div className="meta reveal">{t.strip.meta}</div>
      </div>
      {featured.map((p, i) => (
        <div className="project-row reveal" key={p.id}>
          <div className="project-row__media" onClick={() => onOpen(p)}>
            <img src={p.img} alt={p.title} />
          </div>
          <div className="project-row__body">
            <div className="project-row__num">
              <span>№ {String(i + 1).padStart(2, "0")}</span>
              <span className="divider"></span>
              <span>{p.year}</span>
            </div>
            <h3 className="project-row__title">
              {p.title.split(" ").slice(0, -1).join(" ")}{" "}
              <i className="it">{p.title.split(" ").slice(-1)[0]}</i>
            </h3>
            <div className="project-row__desc">
              {p.location} · {p.surface} · {p.type}
            </div>
            <div className="project-row__tags">
              {p.tags.map((tg) => (
                <span className="project-row__tag" key={tg}>{tg}</span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

/* ---------- Timeline ---------- */
function Timeline({ t, timeline, lang }) {
  const ref = useReveal();
  return (
    <section className="timeline container" ref={ref} data-screen-label="Timeline">
      <div className="strip__head">
        <h2 className="reveal" style={{ fontFamily: "var(--f-display)", fontWeight: 300, fontSize: "clamp(44px, 6vw, 96px)", letterSpacing: "-0.03em", lineHeight: 0.95 }}>
          {t.timeline.title_1} <i className="it">{t.timeline.title_2}</i>
        </h2>
        <div className="meta reveal" style={{ fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-dim)", maxWidth: 280, textAlign: "right", lineHeight: 1.7 }}>
          {t.timeline.meta}
        </div>
      </div>
      <div className="timeline__track">
        {timeline.map((s, i) => (
          <div className="tl-step reveal" key={i}>
            <div className="tl-step__year">{s.year}</div>
            <div className="tl-step__title">
              {lang === "ar" ? s.title_ar : s.title}
            </div>
            <div className="tl-step__desc">
              {lang === "ar" ? s.desc_ar : s.desc}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- Ticker ---------- */
function Ticker({ items }) {
  const loop = [...items, ...items, ...items];
  return (
    <div className="ticker">
      <div className="ticker__track">
        {loop.map((it, i) => (
          <span className="ticker__item" key={i}>
            {it} <span className="star">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- Footer ---------- */
function Footer({ t }) {
  return (
    <footer className="footer" data-screen-label="Footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <h3>{renderMK(t.footer.title)}</h3>
            <p>{t.footer.desc}</p>
          </div>
          <div className="footer__col">
            <h4>{t.footer.col1}</h4>
            {t.footer.col1_links.map((l) => <a key={l} href="#">{l}</a>)}
          </div>
          <div className="footer__col">
            <h4>{t.footer.col2}</h4>
            {t.footer.col2_links.map((l) => <a key={l} href="#">{l}</a>)}
          </div>
          <div className="footer__col">
            <h4>{t.footer.col3}</h4>
            {t.footer.col3_links.map((l) => <a key={l} href="#">{l}</a>)}
          </div>
        </div>
        <div className="footer__bottom">
          <span>{renderMK(t.footer.copyright)}</span>
          <span>{t.footer.credit}</span>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { Nav, HeroCinematic, SplitToggle, Manifesto, Stats, ProjectStrip, Timeline, Ticker, Footer, useReveal });
