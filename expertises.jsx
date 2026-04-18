/* ============================================================
   CABINET MARRAKCHI — ExpertisesSection
   Architecture · Intérieur · Conseil immobilier
   ============================================================ */

function ExpertisesSection({ t }) {
  const ref = useReveal();
  const te = t.expertises;

  return (
    <section className="expertises" id="expertises" ref={ref}
      data-screen-label="Nos Expertises">
      <div className="container">
        <div className="strip__head">
          <div className="eyebrow reveal">{te.eyebrow}</div>
          <h2 className="reveal">
            {te.title_1} <i className="it">{te.title_2}</i>
          </h2>
          <p className="expertises__intro reveal">{te.intro}</p>
        </div>

        <div className="expertises__grid">
          {te.items.map((item, i) => (
            <div
              key={i}
              className={`exp-card reveal${item.highlight ? " exp-card--highlight" : ""}`}
            >
              {/* Number */}
              <div className="exp-card__num">{item.num}</div>

              {/* Title + sub */}
              <div className="exp-card__title">{item.title}</div>
              <div className="exp-card__sub">{item.sub}</div>

              {/* Description */}
              <p className="exp-card__desc">{item.desc}</p>

              {/* Services list */}
              <ul className="exp-card__list">
                {item.services.map((s, j) => (
                  <li key={j}>{s}</li>
                ))}
              </ul>

              {/* CTA */}
              <a href={item.href} className="exp-card__cta">{item.cta}</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { ExpertisesSection });
