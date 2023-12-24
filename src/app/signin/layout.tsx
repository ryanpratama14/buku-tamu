import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";
import { Fragment } from "react";

export default async function SignInLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerAuthSession();
  if (session) redirect("/dashboard");
  return <Fragment>{children}</Fragment>;
}
