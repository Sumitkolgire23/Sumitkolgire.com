"use client";

import { useActionState, useEffect, useRef } from "react";
import { createDiaryEntry } from "@/app/(site)/(private)/lab-diary/actions";

export function DiaryForm() {
  const [state, formAction, pending] = useActionState(createDiaryEntry, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.error === "") {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <div style={{ marginBottom: "3rem", background: "var(--paper-2)", border: "1px solid var(--ink-faint)", padding: "1.5rem" }}>
      <form ref={formRef} action={formAction} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        
        <div>
          <textarea
            name="content"
            required
            disabled={pending}
            placeholder="What's on your mind today?"
            style={{
              width: "100%",
              minHeight: "150px",
              padding: "1rem",
              fontFamily: "var(--mono)",
              fontSize: "0.85rem",
              lineHeight: 1.6,
              color: "var(--ink)",
              background: "transparent",
              border: "1px solid var(--ink-faint)",
              outline: "none",
              resize: "vertical",
              transition: "border-color 0.2s"
            }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <select
              name="mood"
              aria-label="Select mood"
              disabled={pending}
              style={{
                padding: "0.5rem",
                fontFamily: "var(--mono)",
                fontSize: "0.75rem",
                textTransform: "uppercase",
                background: "transparent",
                border: "1px solid var(--ink-faint)",
                color: "var(--ink-mid)",
                outline: "none",
                cursor: "pointer"
              }}
            >
              <option value="reflection">Reflection</option>
              <option value="breakthrough">Breakthrough</option>
              <option value="chaos">Chaos</option>
              <option value="stillness">Stillness</option>
            </select>

            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "var(--mono)", fontSize: "0.75rem", color: "var(--ink-mid)", cursor: "pointer" }}>
              <input type="checkbox" name="isPublic" disabled={pending} />
              <span>Make Public</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={pending}
            style={{
              padding: "0.5rem 1.5rem",
              background: "var(--ink)",
              color: "var(--paper)",
              fontFamily: "var(--mono)",
              fontSize: "0.75rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              border: "none",
              cursor: pending ? "not-allowed" : "pointer",
              opacity: pending ? 0.7 : 1,
              transition: "opacity 0.2s"
            }}
          >
            {pending ? "Saving..." : "Log Entry"}
          </button>
        </div>

        {state?.error && (
          <p style={{ fontFamily: "var(--mono)", fontSize: "0.75rem", color: "var(--seal)", margin: 0 }}>
            {state.error}
          </p>
        )}
      </form>
    </div>
  );
}
