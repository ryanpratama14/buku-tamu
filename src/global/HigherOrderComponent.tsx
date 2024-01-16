"use client";

import { useZustand } from "@/global/store";

import { type Session } from "next-auth";
import { useEffect } from "react";

type Props = { session: Session | null; children: React.ReactNode };

export default function HigherOrderComponent({ session, children }: Props) {
  const { setSession } = useZustand();

  useEffect(() => {
    if (session) setSession(session);
  }, [session]);

  return children;
}
