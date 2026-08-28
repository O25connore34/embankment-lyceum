"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/locale";
import { homeForRole } from "@/lib/format";
import { useSession } from "@/lib/store";

export default function AppIndex() {
  const user = useSession();
  const router = useRouter();
  const { href, dict } = useI18n();
  useEffect(() => {
    if (user) router.replace(href(homeForRole(user.role)));
  }, [user, router, href]);
  return <p className="page">{dict.common.loading}</p>;
}
