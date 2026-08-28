"use client";

import Link from "next/link";
import { RoleGate } from "@/components/app-shell";
import { EmptyState } from "@/components/ui";
import { jsWeekdayToSlot, ln, weekdayName } from "@/lib/format";
import { useI18n } from "@/lib/locale";
import { useDemo, useSession } from "@/lib/store";

export default function SchedulePage() {
  const { locale, dict, href } = useI18n();
  const { state, ready } = useDemo();
  const user = useSession();
  if (!ready || !state || !user) return null;
  const today = jsWeekdayToSlot();
  const days = [1, 2, 3, 4, 5, 6, 7];
  const groupId = user.groupId;

  return (
    <RoleGate allow="student">
      <div className="page">
        <h1>{dict.nav.timetable}</h1>
        <p className="sub">{ln(state.institution.termLabel, locale)}</p>
        {days.map((day) => {
          const slots = state.slots
            .filter((s) => s.groupId === groupId && s.weekday === day)
            .sort((a, b) => a.start.localeCompare(b.start));
          return (
            <section className="panel" key={day} style={{ marginBottom: 16 }}>
              <h2>
                {weekdayName(day, locale)}
                {day === today ? ` · ${dict.common.today}` : ""}
              </h2>
              {slots.length === 0 ? (
                day >= 6 ? (
                  <EmptyState
                    image="/images/empty/empty-schedule.png"
                    title={dict.empty.todayTitle}
                    text={dict.empty.todayText}
                  />
                ) : (
                  <p className="sub">{dict.common.none}</p>
                )
              ) : (
                slots.map((slot) => {
                  const course = state.courses.find((c) => c.id === slot.courseId);
                  if (!course) return null;
                  return (
                    <div className="row-link" key={slot.id}>
                      <span className="time">
                        {slot.start}–{slot.end}
                      </span>
                      <span>
                        <Link href={href(`/app/courses/${course.id}`)}>{ln(course.name, locale)}</Link>
                        <div className="sub">{ln(slot.room, locale)}</div>
                      </span>
                      {slot.meetingUrl ? (
                        <a href={slot.meetingUrl} target="_blank" rel="noreferrer">
                          {dict.student.link}
                        </a>
                      ) : (
                        <span />
                      )}
                    </div>
                  );
                })
              )}
            </section>
          );
        })}
      </div>
    </RoleGate>
  );
}
