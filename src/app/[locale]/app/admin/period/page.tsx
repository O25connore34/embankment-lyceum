"use client";

import { useState } from "react";
import { RoleGate } from "@/components/app-shell";
import { ln } from "@/lib/format";
import { useI18n } from "@/lib/locale";
import { useDemo } from "@/lib/store";

export default function PeriodPage() {
  const { locale, dict } = useI18n();
  const { state, ready, dispatch } = useDemo();
  const [label, setLabel] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [flash, setFlash] = useState("");
  if (!ready || !state) return null;

  return (
    <RoleGate allow="admin">
      <div className="page">
        {flash ? <div className="ok">{flash}</div> : null}
        <h1>{dict.nav.term}</h1>
        <p className="sub">
          {dict.admin.currentTerm}: {ln(state.institution.termLabel, locale)} · {state.institution.termStart} —{" "}
          {state.institution.termEnd}
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            dispatch({
              type: "term",
              termLabel: { ru: label, en: label },
              termStart: start,
              termEnd: end,
            });
            setFlash(dict.student.saved);
          }}
        >
          <label className="field">
            <span>{dict.admin.currentTerm}</span>
            <input value={label} onChange={(e) => setLabel(e.target.value)} required placeholder={ln(state.institution.termLabel, locale)} />
          </label>
          <label className="field">
            <span>{state.institution.termStart}</span>
            <input type="date" value={start} onChange={(e) => setStart(e.target.value)} required />
          </label>
          <label className="field">
            <span>{state.institution.termEnd}</span>
            <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} required />
          </label>
          <button className="btn" type="submit">
            {dict.admin.saveTerm}
          </button>
        </form>
      </div>
    </RoleGate>
  );
}
