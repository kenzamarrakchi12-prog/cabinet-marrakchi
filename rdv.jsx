/* RDV multi-step form */

const { useState: useStateR, useMemo: useMemoR } = React;

function Rdv({ t, lang }) {
  const [step, setStep] = useStateR(0);
  const [data, setData] = useStateR({
    type: null, nature: null, name: "", email: "", phone: "", date: null, message: ""
  });
  const [monthOffset, setMonthOffset] = useStateR(0);

  const ref = useReveal();
  const N = 5;

  const canNext = () => {
    if (step === 0) return !!data.type;
    if (step === 1) return !!data.nature;
    if (step === 2) return data.name && data.email && data.phone;
    if (step === 3) return !!data.date;
    return true;
  };

  const submit = () => setStep(N);

  const monthDate = useMemoR(() => {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() + monthOffset);
    return d;
  }, [monthOffset]);

  const renderCalendar = () => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const first = new Date(year, month, 1).getDay(); // 0=Sun
    const firstMonIdx = (first + 6) % 7; // Mon=0
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date(); today.setHours(0, 0, 0, 0);

    const cells = [];
    for (let i = 0; i < firstMonIdx; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    return (
      <div>
        <div className="rdv__month-head">
          <button onClick={() => setMonthOffset(monthOffset - 1)} disabled={monthOffset <= 0}>←</button>
          <span>{t.rdv.months[month]} {year}</span>
          <button onClick={() => setMonthOffset(monthOffset + 1)}>→</button>
        </div>
        <div className="rdv__calendar">
          {t.rdv.days.map((d) => (
            <div key={d} className="rdv__day rdv__day-head">{d}</div>
          ))}
          {cells.map((d, i) => {
            if (d == null) return <div key={i} className="rdv__day empty"></div>;
            const full = new Date(year, month, d);
            const past = full < today;
            const weekend = full.getDay() === 0;
            const iso = full.toISOString().slice(0, 10);
            const selected = data.date === iso;
            return (
              <button
                key={i}
                className={`rdv__day ${selected ? "selected" : ""}`}
                disabled={past || weekend}
                onClick={() => setData({ ...data, date: iso })}
              >{d}</button>
            );
          })}
        </div>
      </div>
    );
  };

  const fmtDate = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return `${String(d.getDate()).padStart(2, "0")} ${t.rdv.months[d.getMonth()]} ${d.getFullYear()}`;
  };

  const selected = (arr, k) => arr.find((o) => o.k === k);

  return (
    <section className="rdv container" id="rdv" ref={ref} data-screen-label="RDV">
      <div className="rdv__grid">
        <div className="rdv__left">
          <div className="eyebrow reveal" style={{ marginBottom: 32 }}>{t.rdv.eyebrow}</div>
          <h2 className="reveal">
            {t.rdv.title_1} <i className="it">{t.rdv.title_2}</i>
          </h2>
          <p className="reveal">{t.rdv.desc}</p>
          <div className="rdv__contact reveal">
            <div className="rdv__contact-row"><span className="k">{t.rdv.addr_k}</span><span className="v">{t.rdv.contact.address}</span></div>
            <div className="rdv__contact-row"><span className="k">{t.rdv.phone_k}</span><span className="v">{t.rdv.contact.phone}</span></div>
            <div className="rdv__contact-row"><span className="k">{t.rdv.email_k}</span><span className="v">{t.rdv.contact.email}</span></div>
            <div className="rdv__contact-row"><span className="k">{t.rdv.hours_k}</span><span className="v">{t.rdv.contact.hours}</span></div>
          </div>
        </div>

        <div className="rdv__form reveal">
          {step < N ? (
            <>
              <div className="rdv__stepper">
                {Array.from({ length: N }).map((_, i) => (
                  <div key={i} className={`rdv__step-dot ${i < step ? "done" : ""} ${i === step ? "active" : ""}`}></div>
                ))}
              </div>
              <div className="rdv__step-label">
                <span>{t.rdv.steps[step]}</span>
                <span>{t.rdv.step_count(step + 1, N)}</span>
              </div>

              <div className="rdv__step-body">
                {step === 0 && (
                  <>
                    <h3 className="rdv__step-title">{t.rdv.s1_title_1} <i className="it">{t.rdv.s1_title_2}</i></h3>
                    <div className="rdv__step-sub">{t.rdv.s1_sub}</div>
                    <div className="rdv__opts">
                      {t.rdv.s1_opts.map((o) => (
                        <button key={o.k} className={`rdv__opt ${data.type === o.k ? "selected" : ""}`}
                          onClick={() => setData({ ...data, type: o.k })}>
                          <span className="check"></span>
                          <span className="label">{o.label}</span>
                          <span className="hint">{o.hint}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {step === 1 && (
                  <>
                    <h3 className="rdv__step-title">{t.rdv.s2_title_1} <i className="it">{t.rdv.s2_title_2}</i></h3>
                    <div className="rdv__step-sub">{t.rdv.s2_sub}</div>
                    <div className="rdv__opts">
                      {t.rdv.s2_opts.map((o) => (
                        <button key={o.k} className={`rdv__opt ${data.nature === o.k ? "selected" : ""}`}
                          onClick={() => setData({ ...data, nature: o.k })}>
                          <span className="check"></span>
                          <span className="label">{o.label}</span>
                          <span className="hint">{o.hint}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <h3 className="rdv__step-title">{t.rdv.s3_title_1} <i className="it">{t.rdv.s3_title_2}</i></h3>
                    <div className="rdv__step-sub">{t.rdv.s3_sub}</div>
                    <div className="rdv__field">
                      <label>{t.rdv.f_name}</label>
                      <input value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} />
                    </div>
                    <div className="rdv__field-row">
                      <div className="rdv__field">
                        <label>{t.rdv.f_email}</label>
                        <input type="email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} />
                      </div>
                      <div className="rdv__field">
                        <label>{t.rdv.f_phone}</label>
                        <input type="tel" value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} />
                      </div>
                    </div>
                  </>
                )}

                {step === 3 && (
                  <>
                    <h3 className="rdv__step-title">{t.rdv.s4_title_1} <i className="it">{t.rdv.s4_title_2}</i></h3>
                    <div className="rdv__step-sub">{t.rdv.s4_sub}</div>
                    {renderCalendar()}
                  </>
                )}

                {step === 4 && (
                  <>
                    <h3 className="rdv__step-title">{t.rdv.s5_title_1} <i className="it">{t.rdv.s5_title_2}</i></h3>
                    <div className="rdv__step-sub">{t.rdv.s5_sub}</div>
                    <div className="rdv__summary">
                      <div className="rdv__summary-row"><span className="k">{t.rdv.r_type}</span><span className="v">{selected(t.rdv.s1_opts, data.type)?.label || t.rdv.none}</span></div>
                      <div className="rdv__summary-row"><span className="k">{t.rdv.r_nature}</span><span className="v">{selected(t.rdv.s2_opts, data.nature)?.label || t.rdv.none}</span></div>
                      <div className="rdv__summary-row"><span className="k">{t.rdv.r_contact}</span><span className="v">{data.name} · {data.email} · {data.phone}</span></div>
                      <div className="rdv__summary-row"><span className="k">{t.rdv.r_date}</span><span className="v">{fmtDate(data.date)}</span></div>
                    </div>
                    <div className="rdv__field">
                      <label>{t.rdv.f_msg}</label>
                      <textarea rows="3" value={data.message} onChange={(e) => setData({ ...data, message: e.target.value })} />
                    </div>
                  </>
                )}
              </div>

              <div className="rdv__nav">
                <button className="rdv__btn text" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
                  ← {t.rdv.btn_back}
                </button>
                {step < N - 1 ? (
                  <button className="rdv__btn primary" disabled={!canNext()} onClick={() => setStep(step + 1)}>
                    {t.rdv.btn_next} →
                  </button>
                ) : (
                  <button className="rdv__btn primary" onClick={submit}>
                    {t.rdv.btn_submit} ✦
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="rdv__success">
              <div className="rdv__success-mark">{t.rdv.success_mark}</div>
              <h3>{t.rdv.success_t1} <i className="it">{t.rdv.success_t2}</i></h3>
              <p>{t.rdv.success_p}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Rdv });
