import { isAuthenticated } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminLogin } from "./login-form";

export default async function AdminPage() {
  if (await isAuthenticated()) {
    redirect("/admin/dashboard");
  }

  return <AdminLogin />;
}
