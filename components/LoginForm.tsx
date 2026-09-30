"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Mode = "login" | "signup" | "forgot";

export default function LoginForm({ next, linkError }: { next: string; linkError?: boolean }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [msg, setMsg] = useState(linkError ? "That link is invalid or has expired. Please try again." : "");
  const [ok, setOk] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true); setMsg(""); setOk(false);
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email")), password = String(f.get("password"));
    const supabase = createClient();
    const callback = (to: string) => `${location.origin}/auth/callback?next=${encodeURIComponent(to)}`;
    let error: { message: string } | null = null;

    if (mode === "forgot") {
      ({ error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: callback("/reset-password") }));
      if (!error) { setBusy(false); setOk(true); return setMsg("If that email has an account, a reset link is on its way."); }
    } else if (mode === "login") {
      ({ error } = await supabase.auth.signInWithPassword({ email, password }));
      if (!error) { router.push(next); router.refresh(); return; }
    } else {
      const res = await supabase.auth.signUp({ email, password, options: { data: { name: String(f.get("name") || "") }, emailRedirectTo: callback(next) } });
      error = res.error;
      if (!error && res.data.session) { router.push(next); router.refresh(); return; }
      if (!error) { setBusy(false); setOk(true); return setMsg("Check your email and click the link to confirm your account."); }
    }
    setBusy(false);
    if (error) setMsg(error.message);
  }

  const title = { login: "Login", signup: "Create account", forgot: "Reset password" }[mode];
  const link = "text-sm text-brand underline";
  const go = (m: Mode) => { setMode(m); setMsg(""); setOk(false); };

  return (
    <form onSubmit={submit} className="max-w-sm space-y-3">
      <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
      <p className="text-sm text-slate-600">You only need an account to write reviews. Notes are free to view and download.</p>
      {mode === "signup" && <input name="name" placeholder="Your name" required className="field" />}
      <input name="email" type="email" placeholder="Email" required className="field" />
      {mode !== "forgot" && <input name="password" type="password" placeholder="Password (6+ characters)" minLength={6} required className="field" />}
      {msg && <p className={`text-sm ${ok ? "text-brand" : "text-red-700"}`} role="status">{msg}</p>}
      <button disabled={busy} className="btn btn-primary w-full">{busy ? "Please wait..." : mode === "login" ? "Login" : mode === "signup" ? "Sign up" : "Send reset link"}</button>
      <div className="flex flex-col gap-2">
        {mode === "login" && <button type="button" onClick={() => go("forgot")} className={`${link} text-left`}>Forgot password?</button>}
        <button type="button" onClick={() => go(mode === "login" ? "signup" : "login")} className={`${link} text-left`}>
          {mode === "login" ? "New here? Create an account" : "Back to login"}
        </button>
      </div>
    </form>
  );
}
