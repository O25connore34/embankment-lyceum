"use client";

import { useState } from "react";
import { RoleGate } from "@/components/app-shell";
import { ln } from "@/lib/format";
import { useI18n } from "@/lib/locale";
import { useDemo } from "@/lib/store";

export default function SettingsPage() {
  const { locale, dict } = useI18n();
  const { state, ready, dispatch } = useDemo();
  const [nameRu, setNameRu] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [email, setEmail] = useState("");
  const [flash, setFlash] = useState("");
  if (!ready || !state) return null;

  return (
    <RoleGate allow="admin">
      <div className="page">
        {flash ? <div className="ok">{flash}</div> : null}
        <h1>{dict.nav.settings}</h1>
        <p className="sub">{ln(state.institution.name, locale)}</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            dispatch({
              type: "settings",
              name: {
                ru: nameRu || state.institution.name.ru,
                en: nameEn || state.institution.name.en,
              },
              supportEmail: email || state.institution.supportEmail,
            });
            setFlash(dict.student.saved);
          }}
        >
          <label className="field">
            <span>{dict.admin.lyceumName} (RU)</span>
            <input value={nameRu} onChange={(e) => setNameRu(e.target.value)} placeholder={state.institution.name.ru} />
          </label>
          <label className="field">
            <span>{dict.admin.lyceumName} (EN)</span>
            <input value={nameEn} onChange={(e) => setNameEn(e.target.value)} placeholder={state.institution.name.en} />
          </label>
          <label className="field">
            <span>{dict.admin.supportEmail}</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={state.institution.supportEmail}
            />
          </label>
          <button className="btn" type="submit">
            {dict.student.save}
          </button>
        </form>
        <p style={{ marginTop: 32 }}>
          <button
            className="btn brick"
            type="button"
            onClick={() => {
              dispatch({ type: "reset" });
              setFlash(dict.admin.resetDone);
            }}
          >
            {dict.admin.reset}
          </button>
        </p>
      </div>
    </RoleGate>
  );
}
