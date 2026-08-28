"use client";

import { useState } from "react";
import { RoleGate } from "@/components/app-shell";
import { Person } from "@/components/ui";
import { useI18n } from "@/lib/locale";
import { useDemo } from "@/lib/store";
import type { Role } from "@/lib/types";

export default function UsersPage() {
  const { dict } = useI18n();
  const { state, ready, dispatch } = useDemo();
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("student");
  const [password, setPassword] = useState("demo");
  const [flash, setFlash] = useState("");
  if (!ready || !state) return null;

  return (
    <RoleGate allow="admin">
      <div className="page">
        {flash ? <div className="ok">{flash}</div> : null}
        <h1>{dict.nav.people}</h1>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{dict.nav.people}</th>
                <th>{dict.login.email}</th>
                <th>{dict.admin.newRole}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {state.users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <Person user={u} />
                    {u.blocked ? ` · ${dict.admin.block}` : ""}
                  </td>
                  <td>{u.email}</td>
                  <td>{dict.roles[u.role]}</td>
                  <td>
                    <button
                      className="btn ghost small"
                      type="button"
                      onClick={() => dispatch({ type: "toggleBlock", userId: u.id })}
                    >
                      {u.blocked ? dict.admin.unblock : dict.admin.block}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h2 style={{ marginTop: 24 }}>{dict.admin.createUser}</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            dispatch({
              type: "createUser",
              user: {
                email,
                password,
                role,
                firstName: { ru: first, en: first },
                lastName: { ru: last, en: last },
                phone: "",
              },
            });
            setFlash(dict.student.saved);
          }}
        >
          <label className="field">
            <span>{dict.admin.newFirst}</span>
            <input value={first} onChange={(e) => setFirst(e.target.value)} required />
          </label>
          <label className="field">
            <span>{dict.admin.newLast}</span>
            <input value={last} onChange={(e) => setLast(e.target.value)} required />
          </label>
          <label className="field">
            <span>{dict.admin.newEmail}</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label className="field">
            <span>{dict.admin.newRole}</span>
            <select value={role} onChange={(e) => setRole(e.target.value as Role)}>
              <option value="student">{dict.roles.student}</option>
              <option value="teacher">{dict.roles.teacher}</option>
              <option value="admin">{dict.roles.admin}</option>
            </select>
          </label>
          <label className="field">
            <span>{dict.admin.newPassword}</span>
            <input value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          <button className="btn" type="submit">
            {dict.admin.createUser}
          </button>
        </form>
      </div>
    </RoleGate>
  );
}
