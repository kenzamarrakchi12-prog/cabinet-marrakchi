/* Gallery + Lightbox + Before/After */

const { useState: useStateG, useEffect: useEffectG, useRef: useRefG } = React;

function Gallery({ t, projects, lang, layout = "masonry" }) {
  const [filter, setFilter] = useStateG("all");
  const [lightbox, setLightbox] = useStateG(null);
  const ref = useReveal();

  const filtered = projects.filter((p) => {
    if (filter === "all") return true;
    if (filter === "archi") return p.mode === "archi";
    if (filter === "interior") return p.mode === "interior";
    if (filter === "villa") return p.tags?.includes("Villa");
    if (filter === "residence") return p.tags?.includes("Résidence") || p.tags?.includes("Immeuble");
    return true;
  });

  const open = (p) => setLightbox(p);
  const close = () => setLightbox(null);
  const nav = (dir) => {
    const i = filtered.findIndex((x) => x.id === lightbox.id);
    const next = (i + dir + filtered.length) % filtered.length;
    setLightbox(filtered[next]);
  };

  useEffectG(() => {
    if (!lightbox) return;
    const h = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") nav(1);
      if (e.key === "ArrowLeft") nav(-1);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [lightbox]);

  return (
    <section className="gallery container" ref={ref} data-screen-label="Galerie">
      <div className="gallery__head">
        <h2 className="reveal" style={{ fontFamily: "var(--f-display)", fontWeight: 300, fontSize: "clamp(44px, 6vw, 96px)", letterSpacing: "-0.03em", lineHeight: 0.95, maxWidth: "14ch" }}>
          {t.gallery.title_1} <i className="it">{t.gallery.title_2}</i>
        </h2>
        <div className="gallery__filters reveal">
          {["all", "archi", "interior", "villa", "residence"].map((k) => (
            <button key={k} className={`gallery__filter ${filter === k ? "active" : ""}`} onClick={() => setFilter(k)}>
              {t.gallery.filters[k]}
            </button>
          ))}
        </div>
      </div>
      <div className={`gallery__grid layout-${layout}`}>
        {filtered.map((p) => (
          <div className="gallery__item reveal" key={p.id} onClick={() => open(p)}>
            <img src={p.img} alt={p.title} loading="lazy" />
            <div className="gallery__item-meta">
              <div>
                <div className="gallery__item-title">
                  {lang === "ar" ? p.title_ar : p.title}
                </div>
                <div className="gallery__item-tag" style={{ marginTop: 4 }}>
                  {p.location} · {p.year}
                </div>
              </div>
              <div className="gallery__item-tag">{lang === "ar" ? p.type_ar : p.type}</div>
            </div>
          </div>
        ))}
      </div>

      <div className={`lightbox ${lightbox ? "open" : ""}`} onClick={(e) => { if (e.target.classList.contains("lightbox")) close(); }}>
        {lightbox && (
          <>
            <button className="lightbox__close" onClick={close}>Fermer ✕</button>
            <button className="lightbox__nav prev" onClick={() => nav(-1)}>←</button>
            <img className="lightbox__img" src={lightbox.img} alt={lightbox.title} />
            <button className="lightbox__nav next" onClick={() => nav(1)}>→</button>
            <div className="lightbox__meta">
              {(lang === "ar" ? lightbox.title_ar : lightbox.title)} — {lightbox.location} — {lightbox.surface} — {lightbox.year}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

/* Before / After slider */
function BeforeAfter({ t, items }) {
  const item = items[0];
  const [pos, setPos] = useStateG(50);
  const dragging = useRefG(false);
  const slider = useRefG(null);

  const setFromEvent = (e) => {
    const rect = slider.current.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const p = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPos(p);
  };

  useEffectG(() => {
    const up = () => dragging.current = false;
    const move = (e) => { if (dragging.current) setFromEvent(e); };
    window.addEventListener("mouseup", up);
    window.addEventListener("touchend", up);
    window.addEventListener("mousemove", move);
    window.addEventListener("touchmove", move);
    return () => {
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchend", up);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("touchmove", move);
    };
  }, []);

  const ref = useReveal();

  return (
    <section className="ba container" ref={ref} data-screen-label="Before/After">
      <div className="ba__head">
        <h2 className="reveal" style={{ fontFamily: "var(--f-display)", fontWeight: 300, fontSize: "clamp(44px, 6vw, 96px)", letterSpacing: "-0.03em", lineHeight: 0.95 }}>
          {t.ba.title_1} — <i className="it">{t.ba.title_2}</i>
        </h2>
        <div className="meta reveal" style={{ fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-dim)", maxWidth: 280, textAlign: "right", lineHeight: 1.7 }}>
          {t.ba.meta}
        </div>
      </div>
      <div
        className="ba__slider reveal"
        ref={slider}
        onMouseDown={(e) => { dragging.current = true; setFromEvent(e); }}
        onTouchStart={(e) => { dragging.current = true; setFromEvent(e); }}
      >
        <img className="ba__img before" src={item.before} alt="avant" />
        <img className="ba__img after" src={item.after} alt="après" style={{ clipPath: `inset(0 0 0 ${pos}%)` }} />
        <div className="ba__label before">{t.ba.title_1}</div>
        <div className="ba__label after">{t.ba.title_2}</div>
        <div className="ba__handle" style={{ left: `${pos}%` }}>
          <div className="ba__handle-knob">⇆</div>
        </div>
      </div>
      <div style={{ marginTop: 24, fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-dim)" }}>
        {item.title}
      </div>
    </section>
  );
}

Object.assign(window, { Gallery, BeforeAfter });
