"use client";
import Link from "next/link";
import { useState } from "react";

const links = [["Home", "/"], ["Notes", "/notes"], ["Subjects", "/subjects"], ["Exams", "/exams"], ["YouTube", "/youtube"], ["About", "/about"]];

export default function Header({ signedIn, isAdmin }: { signedIn: boolean; isAdmin: boolean }) {
  const [open, setOpen] = useState(false);
  const item = "text-sm font-medium text-slate-700 hover:text-brand";
  const account = (
    <>
      {isAdmin && <Link href="/admin" className={item} onClick={() => setOpen(false)}>Admin</Link>}
      {signedIn ? (
        <form action="/auth/signout" method="post"><button className={item}>Sign out</button></form>
      ) : (
        <Link href="/login" className={item} onClick={() => setOpen(false)}>Login</Link>
      )}
    </>
  );
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-extrabold tracking-tight text-brand">CSE WALE</Link>
        <nav className="hidden items-center gap-5 md:flex">
          {links.map(([label, href]) => <Link key={href} href={href} className={item}>{label}</Link>)}
          {account}
        </nav>
        <button className="md:hidden p-2" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>
      {open && (
        <nav className="flex flex-col gap-4 border-t border-slate-200 px-4 py-4 md:hidden">
          {links.map(([label, href]) => <Link key={href} href={href} className={item} onClick={() => setOpen(false)}>{label}</Link>)}
          {account}
        </nav>
      )}
    </header>
  );
}
