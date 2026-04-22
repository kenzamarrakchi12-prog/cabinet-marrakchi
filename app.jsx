/* Main App shell */

const { useState: useStateA, useEffect: useEffectA } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "ink",
  "palette": "ink",
  "font": "canela",
  "heroStyle": "cinematic",
  "galleryLayout": "masonry",
  "anim": "high",
  "lang": "fr"
}/*EDITMODE-END*/;

function App() {
  const [introDone, setIntroDone] = useStateA(() => {
    try { return sessionStorage.getItem("marrakchi_intro") === "1"; } catch (e) { return false; }
  });
  const [settings, setSettings] = useStateA(() => {
    try {
      const saved = localStorage.getItem("marrakchi_settings");
      if (saved) return { ...TWEAK_DEFAULTS, ...JSON.parse(saved) };
    } catch (e) {}
    return TWEAK_DEFAULTS;
  });
  const [lang, setLang] = useStateA(settings.lang || "fr");
  const [mode, setMode] = useStateA("archi"); // archi | interior
  const [tweaksOpen, setTweaksOpen] = useStateA(false);
  const [tweaksAvailable, setTweaksAvailable] = useStateA(false);

  // Persist settings
  useEffectA(() => {
    try { localStorage.setItem("marrakchi_settings", JSON.stringify(settings)); } catch (e) {}
  }, [settings]);

  // Apply settings to <html>
  useEffectA(() => {
    const h = document.documentElement;
    h.dataset.theme = settings.theme;
    h.dataset.palette = settings.palette;
    h.dataset.font = settings.font;
    h.dataset.anim = settings.anim;
    h.dir = lang === "ar" ? "rtl" : "ltr";
    h.lang = lang;
  }, [settings, lang]);

  // Edit-mode protocol
  useEffectA(() => {
    const handler = (e) => {
      if (!e.data) return;
      if (e.data.type === "__activate_edit_mode") setTweaksAvailable(true);
      if (e.data.type === "__deactivate_edit_mode") { setTweaksAvailable(false); setTweaksOpen(false); }
    };
    window.addEventListener("message", handler);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", handler);
  }, []);

  const t = window.__I18N__[lang];
  const DATA = window.__DATA__;

  const heroImages = [
    "photos/villa-contemporaine-piscine.jpg",
    "photos/immeuble-vegetal.jpg",
    "photos/residence-bois-jaune.jpg",
    "photos/residence-piscine-villas.jpg",
    "photos/villa-15-nuit.jpg",
  ];

  const filteredProjects = DATA.projects.filter((p) => p.mode === mode);
  // Gallery shows all projects, filtered by gallery's own filter buttons
  const allProjects = DATA.projects;

  const onRdv = () => {
    document.getElementById("rdv")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleIntroDone = () => {
    setIntroDone(true);
    try { sessionStorage.setItem("marrakchi_intro", "1"); } catch (e) {}
  };

  // Custom cursor
  useEffectA(() => {
    const dot = document.getElementById("cursor-dot");
    if (!dot) return;
    const move = (e) => { dot.style.left = e.clientX + "px"; dot.style.top = e.clientY + "px"; };
    const grow = () => dot.classList.add("grow");
    const shrink = () => dot.classList.remove("grow");
    document.addEventListener("mousemove", move);
    document.querySelectorAll("a, button, .gallery__item, .ba__slider").forEach(el => {
      el.addEventListener("mouseenter", grow);
      el.addEventListener("mouseleave", shrink);
    });
    return () => document.removeEventListener("mousemove", move);
  }, []);

  return (
    <>
      <div id="cursor-dot" className="cursor-dot"></div>
      {!introDone && <Intro onDone={handleIntroDone} />}
      <Nav
        t={t} lang={lang}
        setLang={(l) => { setLang(l); setSettings({ ...settings, lang: l }); }}
        theme={settings.theme}
        onThemeToggle={() => setSettings({ ...settings, theme: settings.theme === "ink" ? "paper" : "ink" })}
        onRdv={onRdv}
      />

      <HeroCinematic t={t} images={heroImages} heroStyle={settings.heroStyle} />

      <SplitToggle t={t} mode={mode} setMode={setMode} />

      <Manifesto t={t} />

      <Stats t={t} />

      <ExpertisesSection t={t} />

      <ProjectStrip t={t} projects={filteredProjects} onOpen={() => {}} />

      <Ticker items={t.ticker} />

      <Gallery t={t} projects={allProjects} lang={lang} layout={settings.galleryLayout} />

      <BeforeAfter t={t} items={DATA.beforeAfter} />

      <MarketSection t={t} />

      <MRESection t={t} />

      <Timeline t={t} timeline={DATA.timeline} lang={lang} />

      <Rdv t={t} lang={lang} />

      <Footer t={t} />

      {tweaksAvailable && !tweaksOpen && (
        <button className="tweaks-btn visible" onClick={() => setTweaksOpen(true)}>✦</button>
      )}
      <Tweaks active={tweaksAvailable && tweaksOpen} settings={settings} setSettings={setSettings} onClose={() => setTweaksOpen(false)} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
