"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";

/* Vertical Kanji strings — duplicated so the scroll is seamless */
const KANJI = ["静研書思道", "学心墨禅詩", "究知慧観悟", "理論考創志", "智録筆夢真"];

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, undefined);

  return (
    <>
      <style>{`
        /* ── Scoped login tokens ── */
        .login-shell {
          display: grid;
          grid-template-columns: 1fr 1fr;
          height: 100vh;
          overflow: hidden;
          background: var(--bg);
        }

        /* ── Left brand panel ── */
        .login-brand {
          background: var(--bg2);
          border-right: 1px solid var(--border);
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 4rem 4rem 4rem 5rem;
        }

        /* Kanji rain */
        .kanji-bg {
          position: absolute;
          inset: 0;
          display: flex;
          gap: 2.5rem;
          padding: 0 2rem;
          pointer-events: none;
          overflow: hidden;
        }
        .kanji-col {
          font-family: var(--serif);
          font-size: 1.1rem;
          color: var(--border2);
          writing-mode: vertical-rl;
          letter-spacing: .22em;
          animation: kanji-drift 22s linear infinite;
          opacity: .55;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .kanji-col:nth-child(2)  { animation-delay: -4s;  animation-duration: 18s; }
        .kanji-col:nth-child(3)  { animation-delay: -8s;  animation-duration: 26s; }
        .kanji-col:nth-child(4)  { animation-delay: -12s; animation-duration: 20s; }
        .kanji-col:nth-child(5)  { animation-delay: -2s;  animation-duration: 24s; }
        .kanji-col:nth-child(6)  { animation-delay: -14s; animation-duration: 19s; }
        .kanji-col:nth-child(7)  { animation-delay: -6s;  animation-duration: 28s; }
        .kanji-col:nth-child(8)  { animation-delay: -16s; animation-duration: 21s; }
        .kanji-col:nth-child(9)  { animation-delay: -10s; animation-duration: 25s; }
        .kanji-col:nth-child(10) { animation-delay: -18s; animation-duration: 17s; }
        @keyframes kanji-drift {
          from { transform: translateY(0); }
          to   { transform: translateY(-50%); }
        }

        /* Brand content */
        .login-brand-inner {
          position: relative;
          z-index: 2;
        }
        .login-seal-ring {
          width: 54px; height: 54px;
          border-radius: 50%;
          border: 1px solid rgba(196,30,58,.45);
          display: flex; align-items: center; justify-content: center;
          font-family: var(--serif);
          font-size: 1.45rem;
          color: var(--seal);
          margin-bottom: 1.75rem;
          box-shadow: 0 0 18px rgba(196,30,58,.12);
        }
        .login-brand-h1 {
          font-family: var(--serif);
          font-size: clamp(2.4rem, 5vw, 3.2rem);
          font-style: italic;
          color: var(--text);
          line-height: 1.1;
          margin-bottom: .35rem;
        }
        .login-brand-tagline {
          font-family: var(--mono);
          font-size: .68rem;
          color: var(--text2);
          letter-spacing: .28em;
          text-transform: uppercase;
          margin-bottom: 2rem;
        }
        .login-brand-divider {
          width: 32px; height: 1px;
          background: var(--seal);
          opacity: .55;
          margin-bottom: 2rem;
        }
        .login-brand-quote {
          font-family: var(--serif);
          font-size: 1rem;
          font-style: italic;
          color: var(--text2);
          line-height: 1.85;
          max-width: 290px;
        }
        .login-brand-footer {
          position: absolute;
          bottom: 2.5rem; left: 5rem;
          font-family: var(--mono);
          font-size: .6rem;
          color: var(--text3);
          letter-spacing: .18em;
          text-transform: uppercase;
          z-index: 2;
        }

        /* ── Right form panel ── */
        .login-form-panel {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          background: var(--bg);
        }
        .login-form-inner {
          width: 100%;
          max-width: 330px;
        }

        /* Access label */
        .login-access {
          display: flex;
          align-items: center;
          gap: .75rem;
          margin-bottom: 2.75rem;
        }
        .login-access-rule { width: 22px; height: 1px; background: var(--border2); }
        .login-access-text {
          font-family: var(--mono);
          font-size: .72rem;
          letter-spacing: .22em;
          text-transform: uppercase;
          color: var(--text2);
        }

        /* Field */
        .login-field { margin-bottom: 1.5rem; }
        .login-label {
          display: block;
          font-family: var(--mono);
          font-size: .72rem;
          letter-spacing: .15em;
          text-transform: uppercase;
          color: var(--text2);
          margin-bottom: .5rem;
        }
        .login-input {
          width: 100%;
          padding: .7rem 0;
          font-family: var(--mono);
          font-size: 1rem;
          color: var(--text);
          background: transparent;
          border: none;
          border-bottom: 1px solid var(--border2);
          outline: none;
          transition: border-color .2s;
          caret-color: var(--seal);
        }
        .login-input::placeholder { color: var(--text3); font-size: .88rem; }
        .login-input:focus { border-bottom-color: var(--seal); }
        .login-input:disabled { opacity: .5; }

        /* Error */
        .login-error {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--mono);
          font-size: .65rem;
          color: var(--seal);
          margin-bottom: 1rem;
          padding: .5rem .75rem;
          background: rgba(196,30,58,.08);
          border: 1px solid rgba(196,30,58,.2);
          border-radius: 4px;
        }

        /* Submit */
        .login-btn {
          width: 100%;
          padding: .95rem;
          background: var(--seal);
          color: #fff;
          font-family: var(--mono);
          font-size: .72rem;
          font-weight: 600;
          letter-spacing: .18em;
          text-transform: uppercase;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background .2s, opacity .2s, transform .1s;
          margin-bottom: 1.5rem;
          position: relative;
          overflow: hidden;
        }
        .login-btn:hover:not(:disabled) {
          background: #a8182f;
          transform: translateY(-1px);
        }
        .login-btn:active:not(:disabled) { transform: translateY(0); }
        .login-btn:disabled { opacity: .55; cursor: not-allowed; }

        /* Pending shimmer */
        .login-btn.pending::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,.08) 50%, transparent 100%);
          animation: shimmer 1.2s linear infinite;
        }
        @keyframes shimmer {
          from { transform: translateX(-100%); }
          to   { transform: translateX(100%); }
        }

        /* Back link */
        .login-back {
          display: block;
          text-align: center;
          font-family: var(--mono);
          font-size: .68rem;
          letter-spacing: .12em;
          color: var(--text2);
          text-decoration: none;
          transition: color .2s;
          padding: .4rem 0;
        }
        .login-back:hover { color: var(--text); }

        /* Divider */
        .login-sep {
          display: flex;
          align-items: center;
          gap: .75rem;
          margin: 1.5rem 0;
          font-family: var(--mono);
          font-size: .65rem;
          color: var(--text3);
          letter-spacing: .1em;
        }
        .login-sep::before, .login-sep::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--border);
        }

        /* Responsive */
        @media (max-width: 680px) {
          .login-shell { grid-template-columns: 1fr; }
          .login-brand { display: none; }
          .login-form-panel { padding: 2rem 1.5rem; }
        }

        /* Fade in for the whole page */
        .login-shell { animation: fade-in .4s ease-out; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
      `}</style>

      <div className="login-shell">

        {/* ── Left brand panel ── */}
        <div className="login-brand">
          <div className="kanji-bg" aria-hidden="true">
            {[...KANJI, ...KANJI].map((s, i) => (
              <div key={i} className="kanji-col">{s}</div>
            ))}
          </div>

          <div className="login-brand-inner">
            <div className="login-seal-ring">研</div>
            <h1 className="login-brand-h1">研究室</h1>
            <div className="login-brand-tagline">The Private Lab</div>
            <div className="login-brand-divider" />
            <p className="login-brand-quote">
              &ldquo;The master in the art of living makes little distinction between his work and his play.&rdquo;
            </p>
          </div>

          <div className="login-brand-footer">侘び寂び — WABI-SABI</div>
        </div>

        {/* ── Right form panel ── */}
        <div className="login-form-panel">
          <div className="login-form-inner">

            <div className="login-access">
              <div className="login-access-rule" />
              <span className="login-access-text">Lab Access</span>
            </div>

            <form action={formAction}>
              <div className="login-field">
                <label htmlFor="email" className="login-label">Email</label>
                <input
                  id="email" name="email" type="email"
                  required disabled={pending}
                  autoComplete="email"
                  placeholder="author@sumitkolgire.com"
                  className="login-input"
                />
              </div>

              <div className="login-field" style={{ marginBottom: "2.25rem" }}>
                <label htmlFor="password" className="login-label">Password</label>
                <input
                  id="password" name="password" type="password"
                  required disabled={pending}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="login-input"
                />
              </div>

              {state?.error && (
                <div className="login-error" role="alert">
                  <span>⚠</span> {state.error}
                </div>
              )}

              <button
                type="submit"
                disabled={pending}
                className={`login-btn${pending ? " pending" : ""}`}
              >
                {pending ? "Authenticating…" : "Enter the Lab →"}
              </button>
            </form>

            <div className="login-sep">or</div>
            <a href="/" className="login-back">← Back to public site</a>

          </div>
        </div>
      </div>
    </>
  );
}
