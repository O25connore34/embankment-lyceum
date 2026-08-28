"use client";

import type { ReactNode } from "react";
import { DemoProvider } from "@/lib/store";

export function Providers({ children }: { children: ReactNode }) {
  return <DemoProvider>{children}</DemoProvider>;
}
