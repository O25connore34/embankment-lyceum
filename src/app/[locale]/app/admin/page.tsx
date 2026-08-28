"use client";

import Link from "next/link";
import { RoleGate } from "@/components/app-shell";
import { ln } from "@/lib/format";
import { useI18n } from "@/lib/locale";
import { useDemo } from "@/lib/store";

export default function AdminHome() {
  const { locale, dict, href } = useI18n();
  const { state, ready } = useDemo();
  if (!ready || !state) return null;
  const cards = [
    { n: state.users.length, label: dict.admin.peopleCount, href: "/app/admin/users" },
    { n: state.groups.length, label: dict.admin.groupCount, href: "/app/admin/groups" },
    { n: state.courses.length, label: dict.admin.courseCount, href: "/app/admin/courses" },
  ];
  return (
    <RoleGate allow="admin">
      <div className="page">
        <h1>{dict.nav.overview}</h1>
        <p className="sub">
          {dict.admin.currentTerm}: {ln(state.institution.termLabel, locale)}
        </p>
        {cards.map((c) => (
          <Link className="row-link" key={c.href} href={href(c.href)}>
            <span className="mark">{c.n}</span>
            <span>{c.label}</span>
            <span />
          </Link>
        ))}
        <p style={{ marginTop: 24 }}>
          <Link href={href("/app/admin/period")}>{dict.nav.term}</Link>
          {" · "}
          <Link href={href("/app/admin/announcements")}>{dict.nav.announcements}</Link>
          {" · "}
          <Link href={href("/app/admin/settings")}>{dict.nav.settings}</Link>
        </p>
      </div>
    </RoleGate>
  );
}
