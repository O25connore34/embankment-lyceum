"use client";

import { useState } from "react";
import { RoleGate } from "@/components/app-shell";
import { Person } from "@/components/ui";
import { ln } from "@/lib/format";
import { useI18n } from "@/lib/locale";
import { useDemo } from "@/lib/store";

export default function EnrollmentsPage() {
  const { locale, dict } = useI18n();
  const { state, ready, dispatch } = useDemo();
  const [groupId, setGroupId] = useState("g-11b");
  const [studentId, setStudentId] = useState("");
  const [flash, setFlash] = useState("");
  if (!ready || !state) return null;
  const group = state.groups.find((g) => g.id === groupId);
  const students = state.users.filter((u) => u.role === "student");

  return (
    <RoleGate allow="admin">
      <div className="page">
        {flash ? <div className="ok">{flash}</div> : null}
        <h1>{dict.nav.enrollment}</h1>
        <label className="field">
          <span>{dict.nav.groups}</span>
          <select value={groupId} onChange={(e) => setGroupId(e.target.value)}>
            {state.groups.map((g) => (
              <option key={g.id} value={g.id}>
                {ln(g.name, locale)}
              </option>
            ))}
          </select>
        </label>
        {group
          ? group.studentIds.map((id) => {
              const st = state.users.find((u) => u.id === id);
              if (!st) return null;
              return (
                <div className="row-link" key={id}>
                  <span>
                    <Person user={st} />
                  </span>
                  <span />
                  <button
                    className="btn ghost small"
                    type="button"
                    onClick={() => {
                      dispatch({ type: "unenroll", groupId: group.id, studentId: id });
                      setFlash(dict.student.saved);
                    }}
                  >
                    {dict.admin.unenroll}
                  </button>
                </div>
              );
            })
          : null}
        <form
          style={{ marginTop: 20 }}
          onSubmit={(e) => {
            e.preventDefault();
            dispatch({ type: "enroll", groupId, studentId });
            setFlash(dict.student.saved);
          }}
        >
          <label className="field">
            <span>{dict.admin.enroll}</span>
            <select value={studentId} onChange={(e) => setStudentId(e.target.value)} required>
              <option value="">{dict.common.none}</option>
              {students.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.lastName[locale]} {st.firstName[locale]}
                </option>
              ))}
            </select>
          </label>
          <button className="btn" type="submit">
            {dict.admin.enroll}
          </button>
        </form>
      </div>
    </RoleGate>
  );
}
