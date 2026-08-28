"use client";

import Link from "next/link";
import { RoleGate } from "@/components/app-shell";
import { jsWeekdayToSlot, ln, weekdayName } from "@/lib/format";
import { useI18n } from "@/lib/locale";
import { useDemo, useSession } from "@/lib/store";

export default function TeachingSchedulePage() {
  const { locale, dict, href } = useI18n();
  const { state, ready } = useDemo();
  const user = useSession();
  if (!ready || !state || !user) return null;
  const myCourses = new Set(state.courses.filter((c) => c.teacherId === user.id).map((c) => c.id));
  const days = [1, 2, 3, 4, 5, 6, 7];
  const today = jsWeekdayToSlot();

  return (
    <RoleGate allow="teacher">
      <div className="page">
        <h1>{dict.nav.myTimetable}</h1>
        {days.map((day) => {
          const slots = state.slots
            .filter((s) => myCourses.has(s.courseId) && s.weekday === day)
            .sort((a, b) => a.start.localeCompare(b.start));
          return (
            <section className="panel" key={day} style={{ marginBottom: 16 }}>
              <h2>
                {weekdayName(day, locale)}
                {day === today ? ` · ${dict.common.today}` : ""}
              </h2>
              {slots.map((slot) => {
                const course = state.courses.find((c) => c.id === slot.courseId);
                if (!course) return null;
                return (
                  <div className="row-link" key={slot.id}>
                    <span className="time">
                      {slot.start}–{slot.end}
                    </span>
                    <span>
                      <Link href={href(`/app/teaching/courses/${course.id}`)}>{ln(course.name, locale)}</Link>
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
              })}
            </section>
          );
        })}
      </div>
    </RoleGate>
  );
}
