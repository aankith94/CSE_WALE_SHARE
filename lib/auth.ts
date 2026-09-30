import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const getSession = cache(async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { user: null, isAdmin: false };
  const { data } = await supabase.from("users").select("is_admin").eq("id", user.id).maybeSingle();
  return { user, isAdmin: !!data?.is_admin };
});

export async function requireAdmin() {
  const { user, isAdmin } = await getSession();
  if (!user) redirect("/login?next=/admin");
  if (!isAdmin) redirect("/");
}
