"use client";

import { useEffect, useState } from "react";
import { RoleGate } from "@/components/app-shell";
import { Person } from "@/components/ui";
import { ln } from "@/lib/format";
import { useI18n } from "@/lib/locale";
import { passwordOk, useDemo, useSession } from "@/lib/store";

export default function ProfilePage() {
  const { locale, dict } = useI18n();
  const { state, ready, dispatch } = useDemo();
  const user = useSession();
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [flash, setFlash] = useState("");
  const [err, setErr] = useState("");
  useEffect(() => {
    if (user) setPhone(user.phone);
  }, [user]);
  if (!ready || !state || !user) return null;

  return (
    <RoleGate allow={["student", "teacher", "admin"]}>
      <div className="page">
        <h1>{dict.profile.title}</h1>
        {flash ? <div className="ok">{flash}</div> : null}
        {err ? <div className="error">{err}</div> : null}
        <div className="course-head">
          <img src={user.avatar} alt="" width={220} height={220} style={{ height: 220, objectFit: "cover" }} />
          <div>
            <Person user={user} />
            <p className="sub">{user.email}</p>
            <p className="sub">{dict.roles[user.role]}</p>
            {user.groupId ? (
              <p className="sub">
                {ln(state.groups.find((g) => g.id === user.groupId)?.name ?? { ru: "", en: "" }, locale)}
              </p>
            ) : null}
          </div>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            dispatch({ type: "profile", userId: user.id, phone });
            setFlash(dict.student.saved);
            setErr("");
          }}
        >
          <label className="field">
            <span>{dict.profile.phone}</span>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </label>
          <button className="btn" type="submit">
            {dict.student.save}
          </button>
        </form>
        <h2 style={{ marginTop: 32 }}>{dict.profile.changePassword}</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!passwordOk(state, user.id, current, next)) {
              setErr(dict.profile.wrongCurrent);
              setFlash("");
              return;
            }
            dispatch({ type: "password", userId: user.id, current, next });
            setFlash(dict.profile.passwordChanged);
            setErr("");
            setCurrent("");
            setNext("");
          }}
        >
          <label className="field">
            <span>{dict.profile.current}</span>
            <input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} required />
          </label>
          <label className="field">
            <span>{dict.profile.next}</span>
            <input type="password" value={next} onChange={(e) => setNext(e.target.value)} minLength={4} required />
          </label>
          <button className="btn brick" type="submit">
            {dict.student.save}
          </button>
        </form>
      </div>
    </RoleGate>
  );
}
