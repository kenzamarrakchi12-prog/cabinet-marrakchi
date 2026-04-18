/* Tweaks panel */

const { useState: useStateT, useEffect: useEffectT } = React;

function Tweaks({ active, settings, setSettings, onClose }) {
  if (!active) return null;

  const set = (k, v) => {
    const next = { ...settings, [k]: v };
    setSettings(next);
    window.parent.postMessage({ type: "__edit_mode_set_keys", edits: { [k]: v } }, "*");
  };

  return (
    <div className="tweaks open">
      <div className="tweaks__head">
        <span className="tweaks__title">Tweaks</span>
        <button className="tweaks__close" onClick={onClose}>✕</button>
      </div>

      <div className="tweaks__group">
        <span className="tweaks__label">Thème</span>
        <div className="tweaks__row">
          {["ink", "paper"].map((k) => (
            <button key={k} className={`tweaks__chip ${settings.theme === k ? "active" : ""}`} onClick={() => set("theme", k)}>
              {k === "ink" ? "Nuit" : "Jour"}
            </button>
          ))}
        </div>
      </div>

      <div className="tweaks__group">
        <span className="tweaks__label">Palette</span>
        <div className="tweaks__row" style={{ gap: 10 }}>
          {[
            { k: "ink",    c: "#0047AB", label: "Bleu roi" },
            { k: "ochre",  c: "#D97706", label: "Ocre" },
            { k: "olive",  c: "#849170", label: "Olive" },
            { k: "cobalt", c: "#3E5C96", label: "Cobalt" },
          ].map((p) => (
            <button key={p.k}
              className={`tweaks__swatch ${settings.palette === p.k ? "active" : ""}`}
              style={{ background: p.c }}
              onClick={() => set("palette", p.k)}
              title={p.k}
            />
          ))}
        </div>
      </div>

      <div className="tweaks__group">
        <span className="tweaks__label">Typographie</span>
        <div className="tweaks__row">
          {[
            { k: "canela", l: "Fraunces" },
            { k: "playfair", l: "Playfair" },
            { k: "cormorant", l: "Cormorant" },
            { k: "ibm-plex", l: "IBM Plex" },
          ].map((f) => (
            <button key={f.k} className={`tweaks__chip ${settings.font === f.k ? "active" : ""}`} onClick={() => set("font", f.k)}>
              {f.l}
            </button>
          ))}
        </div>
      </div>

      <div className="tweaks__group">
        <span className="tweaks__label">Hero</span>
        <div className="tweaks__row">
          {[
            { k: "cinematic", l: "Cinéma" },
            { k: "split", l: "Split" },
          ].map((f) => (
            <button key={f.k} className={`tweaks__chip ${settings.heroStyle === f.k ? "active" : ""}`} onClick={() => set("heroStyle", f.k)}>
              {f.l}
            </button>
          ))}
        </div>
      </div>

      <div className="tweaks__group">
        <span className="tweaks__label">Galerie</span>
        <div className="tweaks__row">
          {[
            { k: "masonry", l: "Masonry" },
            { k: "tight", l: "Dense" },
            { k: "editorial", l: "Éditorial" },
          ].map((f) => (
            <button key={f.k} className={`tweaks__chip ${settings.galleryLayout === f.k ? "active" : ""}`} onClick={() => set("galleryLayout", f.k)}>
              {f.l}
            </button>
          ))}
        </div>
      </div>

      <div className="tweaks__group">
        <span className="tweaks__label">Animations</span>
        <div className="tweaks__row">
          {[
            { k: "high", l: "Élevée" },
            { k: "low", l: "Sobres" },
          ].map((f) => (
            <button key={f.k} className={`tweaks__chip ${settings.anim === f.k ? "active" : ""}`} onClick={() => set("anim", f.k)}>
              {f.l}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Tweaks });
