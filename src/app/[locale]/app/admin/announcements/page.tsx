"use client";

import { useState } from "react";
import { RoleGate } from "@/components/app-shell";
import { formatDateTime, ln } from "@/lib/format";
import { useI18n } from "@/lib/locale";
import { useDemo, useSession } from "@/lib/store";

export default function AnnouncementsPage() {
  const { locale, dict } = useI18n();
  const { state, ready, dispatch } = useDemo();
  const user = useSession();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState("all");
  const [flash, setFlash] = useState("");
  if (!ready || !state || !user) return null;

  return (
    <RoleGate allow="admin">
      <div className="page">
        {flash ? <div className="ok">{flash}</div> : null}
        <h1>{dict.nav.announcements}</h1>
        {state.announcements.map((a) => (
          <div className="panel" key={a.id} style={{ marginBottom: 12 }}>
            <h2>{ln(a.title, locale)}</h2>
            <p className="sub">{formatDateTime(a.createdAt, locale)}</p>
            <p>{ln(a.body, locale)}</p>
          </div>
        ))}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            dispatch({
              type: "announce",
              title: { ru: title, en: title },
              body: { ru: body, en: body },
              audience,
              authorId: user.id,
            });
            setTitle("");
            setBody("");
            setFlash(dict.student.saved);
          }}
        >
          <label className="field">
            <span>{dict.nav.announcements}</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </label>
          <label className="field">
            <span>{dict.teacher.comment}</span>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} required />
          </label>
          <label className="field">
            <span>{dict.admin.audience}</span>
            <select value={audience} onChange={(e) => setAudience(e.target.value)}>
              <option value="all">{dict.admin.allLyceum}</option>
              {state.groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {ln(g.name, locale)}
                </option>
              ))}
            </select>
          </label>
          <button className="btn" type="submit">
            {dict.admin.publish}
          </button>
        </form>
      </div>
    </RoleGate>
  );
}
