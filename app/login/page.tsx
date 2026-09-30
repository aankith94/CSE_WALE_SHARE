import { redirect } from "next/navigation";
import LoginForm from "@/components/LoginForm";
import { getSession } from "@/lib/auth";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const { next = "/", error } = await searchParams;
  const safe = next.startsWith("/") && !next.startsWith("//") ? next : "/";
  const { user } = await getSession();
  if (user) redirect(safe);
  return <LoginForm next={safe} linkError={error === "link"} />;
}
