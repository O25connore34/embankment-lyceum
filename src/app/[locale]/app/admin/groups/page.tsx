"use client";

import { useState } from "react";
import { RoleGate } from "@/components/app-shell";
import { ln } from "@/lib/format";
import { useI18n } from "@/lib/locale";
import { useDemo } from "@/lib/store";

export default function GroupsPage() {
  const { locale, dict } = useI18n();
  const { state, ready, dispatch } = useDemo();
  const [name, setName] = useState("");
  const [flash, setFlash] = useState("");
  if (!ready || !state) return null;

  return (
    <RoleGate allow="admin">
      <div className="page">
        {flash ? <div className="ok">{flash}</div> : null}
        <h1>{dict.nav.groups}</h1>
        {state.groups.map((g) => (
          <div className="row-link" key={g.id}>
            <span className="mark">{g.studentIds.length}</span>
            <span>{ln(g.name, locale)}</span>
            <span />
          </div>
        ))}
        <form
          style={{ marginTop: 24 }}
          onSubmit={(e) => {
            e.preventDefault();
            dispatch({ type: "createGroup", name: { ru: name, en: name } });
            setName("");
            setFlash(dict.student.saved);
          }}
        >
          <label className="field">
            <span>{dict.admin.createGroup}</span>
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <button className="btn" type="submit">
            {dict.admin.createGroup}
          </button>
        </form>
      </div>
    </RoleGate>
  );
}
