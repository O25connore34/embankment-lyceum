"use client";

import { useState } from "react";
import { RoleGate } from "@/components/app-shell";
import { ln, personName } from "@/lib/format";
import { useI18n } from "@/lib/locale";
import { useDemo } from "@/lib/store";

export default function AdminCoursesPage() {
  const { locale, dict } = useI18n();
  const { state, ready, dispatch } = useDemo();
  const [name, setName] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [groupId, setGroupId] = useState("");
  const [room, setRoom] = useState("");
  const [flash, setFlash] = useState("");
  if (!ready || !state) return null;
  const teachers = state.users.filter((u) => u.role === "teacher");

  return (
    <RoleGate allow="admin">
      <div className="page">
        {flash ? <div className="ok">{flash}</div> : null}
        <h1>{dict.nav.subjects}</h1>
        {state.courses.map((c) => {
          const teacher = state.users.find((u) => u.id === c.teacherId);
          return (
            <form
              className="panel"
              key={c.id}
              style={{ marginBottom: 12 }}
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                dispatch({
                  type: "patchCourse",
                  courseId: c.id,
                  teacherId: String(fd.get("teacher")),
                  groupIds: [String(fd.get("group"))],
                });
                setFlash(dict.student.saved);
              }}
            >
              <h2>{ln(c.name, locale)}</h2>
              <p className="sub">{teacher ? personName(teacher, locale) : ""}</p>
              <label className="field">
                <span>{dict.admin.assignTeacher}</span>
                <select name="teacher" defaultValue={c.teacherId}>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {personName(t, locale)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>{dict.admin.assignGroups}</span>
                <select name="group" defaultValue={c.groupIds[0]}>
                  {state.groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {ln(g.name, locale)}
                    </option>
                  ))}
                </select>
              </label>
              <button className="btn small" type="submit">
                {dict.student.save}
              </button>
            </form>
          );
        })}
        <h2>{dict.admin.createCourse}</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            dispatch({
              type: "createCourse",
              name: { ru: name, en: name },
              teacherId,
              groupIds: groupId ? [groupId] : [],
              room: { ru: room, en: room },
            });
            setFlash(dict.student.saved);
          }}
        >
          <label className="field">
            <span>{dict.nav.subjects}</span>
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label className="field">
            <span>{dict.admin.assignTeacher}</span>
            <select value={teacherId} onChange={(e) => setTeacherId(e.target.value)} required>
              <option value="">{dict.common.none}</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {personName(t, locale)}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>{dict.admin.assignGroups}</span>
            <select value={groupId} onChange={(e) => setGroupId(e.target.value)}>
              <option value="">{dict.common.none}</option>
              {state.groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {ln(g.name, locale)}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>{dict.student.room}</span>
            <input value={room} onChange={(e) => setRoom(e.target.value)} required />
          </label>
          <button className="btn" type="submit">
            {dict.admin.createCourse}
          </button>
        </form>
      </div>
    </RoleGate>
  );
}
