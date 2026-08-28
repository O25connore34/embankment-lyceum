"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PublicShell } from "@/components/public-chrome";
import { useI18n } from "@/lib/locale";
import { homeForRole } from "@/lib/format";
import { useDemo, useSession } from "@/lib/store";

const demos = [
  {
    email: "student@embankment.local",
    avatar: "/images/avatars/avatar-mira.png",
    key: "student" as const,
  },
  {
    email: "teacher@embankment.local",
    avatar: "/images/avatars/avatar-sokolova.png",
    key: "teacher" as const,
  },
  {
    email: "admin@embankment.local",
    avatar: "/images/avatars/avatar-volkov.png",
    key: "admin" as const,
  },
];

export default function LoginPage() {
  const { dict, href } = useI18n();
  const { login, ready } = useDemo();
  const session = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (session) router.replace(href(homeForRole(session.role)));
  }, [session, router, href]);

  function enter(nextEmail: string, nextPassword: string) {
    const nextUser = login(nextEmail, nextPassword);
    if (!nextUser) {
      setError(true);
      return;
    }
    window.location.assign(href(homeForRole(nextUser.role)));
  }

  return (
    <PublicShell>
      <div className="auth">
        <p className="kicker">{dict.brand.portal}</p>
        <h1>{dict.login.title}</h1>
        <p className="lead">{dict.login.lead}</p>
        {error ? <div className="error">{dict.login.error}</div> : null}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            enter(email, password);
          }}
        >
          <label className="field">
            <span>{dict.login.email}</span>
            <input
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="field">
            <span>{dict.login.password}</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button className="btn" type="submit" disabled={!ready}>
            {dict.login.submit}
          </button>
        </form>
        <p style={{ marginTop: 16 }}>
          <Link href={href("/forgot-password")}>{dict.nav.forgot}</Link>
        </p>
        <div className="accounts">
          {demos.map((d) => (
            <button
              key={d.email}
              type="button"
              className="account"
              onClick={() => enter(d.email, "demo")}
              style={{ width: "100%", background: "transparent", border: 0, textAlign: "left", cursor: "pointer" }}
            >
              <img src={d.avatar} alt="" width={56} height={56} />
              <div>
                <strong>
                  {dict.login.asRole} {dict.roles[d.key]}
                </strong>
                <div className="sub">
                  {d.email} · {dict.login.demoPassword}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </PublicShell>
  );
}
