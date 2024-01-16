import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";
import DashboardMenu from "./components/Layout";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerAuthSession();
  if (!session) redirect("/signin");
  return <DashboardMenu session={session}>{children}</DashboardMenu>;
}
