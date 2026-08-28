"use client";

import Link from "next/link";
import { RoleGate } from "@/components/app-shell";
import { EmptyState } from "@/components/ui";
import { formatDateTime, homeForRole, ln } from "@/lib/format";
import { useI18n } from "@/lib/locale";
import { useDemo, useSession } from "@/lib/store";

export default function NoticesPage() {
  const { locale, dict, href } = useI18n();
  const { state, ready, dispatch } = useDemo();
  const user = useSession();
  if (!ready || !state || !user) return null;
  const items = state.notices.filter((n) => n.userId === user.id);

  return (
    <RoleGate allow={["student", "teacher", "admin"]}>
      <div className="page">
        <h1>{dict.nav.notices}</h1>
        {items.length === 0 ? (
          <EmptyState
            image="/images/empty/empty-notices.png"
            title={dict.empty.noticesTitle}
            text={dict.empty.noticesText}
          />
        ) : (
          items.map((n) => (
            <Link
              className="row-link"
              key={n.id}
              href={href(n.href || homeForRole(user.role))}
              onClick={() => dispatch({ type: "readNotice", noticeId: n.id })}
            >
              <span className="time">{formatDateTime(n.createdAt, locale)}</span>
              <span>
                <strong>{ln(n.title, locale)}</strong>
                <div className="sub">{ln(n.body, locale)}</div>
              </span>
              <span>{n.read ? "" : "●"}</span>
            </Link>
          ))
        )}
      </div>
    </RoleGate>
  );
}
