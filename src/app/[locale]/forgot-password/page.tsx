"use client";

import { useState } from "react";
import Link from "next/link";
import { PublicShell } from "@/components/public-chrome";
import { useI18n } from "@/lib/locale";

export default function ForgotPage() {
  const { dict, href } = useI18n();
  const [done, setDone] = useState(false);
  return (
    <PublicShell>
      <div className="auth">
        <h1>{dict.forgot.title}</h1>
        <p className="lead">{dict.forgot.lead}</p>
        {done ? (
          <div className="ok">
            <p>{dict.forgot.done}</p>
            <p>
              <Link href={href("/login")}>{dict.forgot.back}</Link>
            </p>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setDone(true);
            }}
          >
            <label className="field">
              <span>{dict.forgot.email}</span>
              <input type="email" required />
            </label>
            <button className="btn" type="submit">
              {dict.forgot.submit}
            </button>
          </form>
        )}
      </div>
    </PublicShell>
  );
}
