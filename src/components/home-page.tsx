"use client";

import Link from "next/link";
import { PublicShell } from "./public-chrome";
import type { Dictionary } from "@/i18n/ru";
import type { Locale } from "@/lib/types";

export function HomePage({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const p = (path: string) => `/${locale}${path}`;
  return (
    <PublicShell>
      <section className="hero">
        <div className="wrap hero-copy">
          <p className="kicker">{dict.home.kicker}</p>
          <h1>{dict.home.headline}</h1>
          <p className="lead">{dict.home.lead}</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link className="btn" href={p("/login")}>
              {dict.home.enterDemo}
            </Link>
            <Link className="btn ghost" href={p("/login")}>
              {dict.nav.signIn}
            </Link>
          </div>
        </div>
        <figure className="hero-photo">
          <img
            src="/images/hero/hero-classroom.png"
            alt={
              locale === "ru"
                ? "Утренний класс лицея: парты, доска с мелом, свет из высоких окон"
                : "Morning lyceum classroom: wooden desks, chalk board, daylight from tall windows"
            }
            width={1600}
            height={900}
          />
        </figure>
      </section>

      <section className="section">
        <div className="wrap split">
          <figure className="frame" style={{ position: "relative" }}>
            <img
              src="/images/how/how-gradebook.png"
              alt={
                locale === "ru"
                  ? "Открытый бумажный журнал на дубовом столе, ручка и мел"
                  : "Open paper register on an oak desk, pen and chalk"
              }
              width={1200}
              height={900}
            />
          </figure>
          <div>
            <h2>{dict.home.howTitle}</h2>
            <p className="lead">{dict.home.howLead}</p>
            <div className="steps">
              {dict.home.steps.map((step) => (
                <div className="step" key={step.n}>
                  <div className="n">{step.n}</div>
                  <div>
                    <strong>{step.title}</strong>
                    <p className="sub" style={{ margin: "6px 0 0" }}>
                      {step.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2>{dict.home.whoTitle}</h2>
          <p className="lead">{dict.home.whoLead}</p>
          <div className="role-row">
            <img
              src="/images/avatars/avatar-mira.png"
              alt={dict.home.studentName}
              width={140}
              height={140}
            />
            <div>
              <p className="kicker">{dict.roles.student}</p>
              <h3>{dict.home.studentName}</h3>
              <p>{dict.home.studentText}</p>
              <Link href={p("/login")}>{dict.login.asRole} {dict.roles.student.toLowerCase()}</Link>
            </div>
          </div>
          <div className="role-row">
            <img
              src="/images/avatars/avatar-sokolova.png"
              alt={dict.home.teacherName}
              width={140}
              height={140}
            />
            <div>
              <p className="kicker">{dict.roles.teacher}</p>
              <h3>{dict.home.teacherName}</h3>
              <p>{dict.home.teacherText}</p>
              <Link href={p("/login")}>{dict.login.asRole} {dict.roles.teacher.toLowerCase()}</Link>
            </div>
          </div>
          <div className="role-row">
            <img
              src="/images/avatars/avatar-volkov.png"
              alt={dict.home.adminName}
              width={140}
              height={140}
            />
            <div>
              <p className="kicker">{dict.roles.admin}</p>
              <h3>{dict.home.adminName}</h3>
              <p>{dict.home.adminText}</p>
              <Link href={p("/login")}>{dict.login.asRole} {dict.roles.admin.toLowerCase()}</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap split">
          <div className="bulletin">
            <h2>{dict.home.accessTitle}</h2>
            <p>{dict.home.accessLead}</p>
            <p className="sub">{dict.home.accessNote}</p>
            <div className="accounts">
              <Link className="account" href={p("/login")}>
                <img src="/images/avatars/avatar-mira.png" alt="" width={56} height={56} />
                <div>
                  <strong>{dict.home.studentName}</strong>
                  <div className="sub">student@embankment.local · {dict.login.demoPassword}</div>
                </div>
                <span className="btn small">{dict.home.enterDemo}</span>
              </Link>
              <Link className="account" href={p("/login")}>
                <img src="/images/avatars/avatar-sokolova.png" alt="" width={56} height={56} />
                <div>
                  <strong>{dict.home.teacherName}</strong>
                  <div className="sub">teacher@embankment.local · {dict.login.demoPassword}</div>
                </div>
                <span className="btn small">{dict.home.enterDemo}</span>
              </Link>
              <Link className="account" href={p("/login")}>
                <img src="/images/avatars/avatar-volkov.png" alt="" width={56} height={56} />
                <div>
                  <strong>{dict.home.adminName}</strong>
                  <div className="sub">admin@embankment.local · {dict.login.demoPassword}</div>
                </div>
                <span className="btn small">{dict.home.enterDemo}</span>
              </Link>
            </div>
          </div>
          <figure className="frame" style={{ position: "relative" }}>
            <img
              src="/images/campus/campus-corridor.png"
              alt={dict.home.corridorCaption}
              width={1600}
              height={900}
            />
            <figcaption>{dict.home.corridorCaption}</figcaption>
          </figure>
        </div>
      </section>
    </PublicShell>
  );
}
