"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetForm() {
  const router = useRouter();
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true); setMsg("");
    const password = String(new FormData(e.currentTarget).get("password"));
    const { error } = await createClient().auth.updateUser({ password });
    setBusy(false);
    if (error) return setMsg(error.message);
    router.push("/"); router.refresh();
  }

  return (
    <form onSubmit={submit} className="max-w-sm space-y-3">
      <h1 className="text-3xl font-extrabold tracking-tight">Choose a new password</h1>
      <input name="password" type="password" placeholder="New password (6+ characters)" minLength={6} required className="field" />
      {msg && <p className="text-sm text-red-700" role="status">{msg}</p>}
      <button disabled={busy} className="btn btn-primary w-full">{busy ? "Saving..." : "Save password"}</button>
    </form>
  );
}
