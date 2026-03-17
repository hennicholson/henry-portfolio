import { isAuthenticated } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardShell } from "./dashboard-shell";

export default async function DashboardPage() {
  if (!(await isAuthenticated())) {
    redirect("/admin");
  }

  return <DashboardShell />;
}
