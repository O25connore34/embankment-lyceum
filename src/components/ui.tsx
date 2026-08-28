"use client";

import type { SubmissionStatus, User } from "@/lib/types";
import { markLabel, personName } from "@/lib/format";
import { useI18n } from "@/lib/locale";

const statusClass: Record<string, string> = {
  accepted: "ok",
  returned: "bad",
  overdue: "bad",
  in_review: "warn",
  submitted: "warn",
  late: "warn",
  open: "mute",
};

export function Chip({
  status,
  late,
}: {
  status: SubmissionStatus | "open" | "overdue";
  late?: boolean;
}) {
  const { dict } = useI18n();
  const label =
    status === "submitted"
      ? dict.status.submitted
      : status === "in_review"
        ? dict.status.in_review
        : status === "accepted"
          ? dict.status.accepted
          : status === "returned"
            ? dict.status.returned
            : status === "overdue"
              ? dict.status.overdue
              : dict.status.open;
  return (
    <span className={`chip ${statusClass[status] ?? "mute"}`}>
      {label}
      {late ? ` · ${dict.status.late}` : ""}
    </span>
  );
}

export function Person({ user }: { user: User }) {
  const { locale } = useI18n();
  return (
    <span className="person">
      <img src={user.avatar} alt="" width={36} height={36} />
      {personName(user, locale)}
    </span>
  );
}

export function EmptyState({
  image,
  title,
  text,
}: {
  image: string;
  title: string;
  text: string;
}) {
  return (
    <div className="empty">
      <img src={image} alt="" width={180} height={135} />
      <div>
        <h2>{title}</h2>
        <p className="sub">{text}</p>
      </div>
    </div>
  );
}

export function Mark({ value }: { value: number }) {
  const { locale } = useI18n();
  return (
    <span className="mark" title={markLabel(value, locale)}>
      {value}
    </span>
  );
}
