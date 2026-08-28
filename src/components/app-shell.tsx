"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Logo } from "./logo";
import { LocaleSwitch } from "./public-chrome";
import { useI18n } from "@/lib/locale";
import { homeForRole, ln, personName } from "@/lib/format";
import { useDemo, useSession } from "@/lib/store";
import type { Role } from "@/lib/types";

function NavLink({ href, label }: { href: string; label: string }) {
  const { href: withLocale } = useI18n();
  const pathname = usePathname() || "";
  const full = withLocale(href);
  const on = pathname === full || pathname.startsWith(`${full}/`);
  return (
    <Link href={full} className={on ? "on" : ""}>
      {label}
    </Link>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { href, dict, locale } = useI18n();
  const { state, ready, dispatch } = useDemo();
  const user = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (!user) router.replace(href("/login"));
  }, [ready, user, router, href]);

  if (!ready || !state) {
    return <p className="page">{dict.common.loading}</p>;
  }
  if (!user) return <p className="page">{dict.common.loading}</p>;

  const unread = state.notices.filter((n) => n.userId === user.id && !n.read).length;
  const name = ln(state.institution.name, locale);

  const studentNav = [
    { href: "/app/today", label: dict.nav.today },
    { href: "/app/schedule", label: dict.nav.timetable },
    { href: "/app/courses", label: dict.nav.subjects },
    { href: "/app/assignments", label: dict.nav.assignments },
    { href: "/app/grades", label: dict.nav.gradebook },
  ];
  const teacherNav = [
    { href: "/app/teaching", label: dict.nav.teaching },
    { href: "/app/teaching/schedule", label: dict.nav.myTimetable },
  ];
  const adminNav = [
    { href: "/app/admin", label: dict.nav.overview },
    { href: "/app/admin/users", label: dict.nav.people },
    { href: "/app/admin/groups", label: dict.nav.groups },
    { href: "/app/admin/courses", label: dict.nav.subjects },
    { href: "/app/admin/enrollments", label: dict.nav.enrollment },
    { href: "/app/admin/period", label: dict.nav.term },
    { href: "/app/admin/announcements", label: dict.nav.announcements },
    { href: "/app/admin/settings", label: dict.nav.settings },
  ];
  const nav =
    user.role === "teacher" ? teacherNav : user.role === "admin" ? adminNav : studentNav;

  return (
    <div className="app">
      <aside className={`side${open ? " open" : ""}`}>
        <Link className="brand" href={href(homeForRole(user.role))} onClick={() => setOpen(false)}>
          <Logo size={28} />
          <div>
            <strong>{name}</strong>
            <span>{dict.roles[user.role]}</span>
          </div>
        </Link>
        <nav onClick={() => setOpen(false)}>
          {nav.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} />
          ))}
          <NavLink
            href="/app/notifications"
            label={`${dict.nav.notices}${unread ? ` (${unread})` : ""}`}
          />
          <NavLink href="/app/profile" label={dict.nav.profile} />
        </nav>
        <div className="side-user">
          <p>{personName(user, locale)}</p>
          <button
            type="button"
            className="btn ghost small"
            onClick={() => {
              dispatch({ type: "logout" });
              router.push(href("/"));
            }}
          >
            {dict.nav.signOut}
          </button>
        </div>
      </aside>
      <div className="main">
        <div className="topbar">
          <button type="button" className="btn ghost small menu-btn" onClick={() => setOpen((v) => !v)}>
            {open ? "×" : "☰"}
          </button>
          <LocaleSwitch />
        </div>
        {children}
      </div>
    </div>
  );
}

export function RoleGate({
  allow,
  children,
}: {
  allow: Role | Role[];
  children: ReactNode;
}) {
  const user = useSession();
  const { href, dict } = useI18n();
  if (!user) return null;
  const ok = Array.isArray(allow) ? allow.includes(user.role) : user.role === allow;
  if (!ok) {
    return (
      <div className="page">
        <h1>{dict.common.forbiddenTitle}</h1>
        <p className="sub">{dict.common.forbiddenText}</p>
        <Link className="btn" href={href(homeForRole(user.role))}>
          {dict.common.toCabinet}
        </Link>
      </div>
    );
  }
  return children;
}
