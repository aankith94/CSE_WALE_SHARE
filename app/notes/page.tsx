import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { NOTE_SELECT, type Exam, type Note, type Subject } from "@/lib/types";
import NoteRow from "@/components/NoteRow";
import Empty from "@/components/Empty";

const PAGE_SIZE = 12;

export default async function NotesPage({ searchParams }: { searchParams: Promise<{ q?: string; subject?: string; exam?: string; page?: string }> }) {
  const { q = "", subject = "", exam = "", page = "1" } = await searchParams;
  const current = Math.max(1, parseInt(page) || 1);
  const from = (current - 1) * PAGE_SIZE;
  const supabase = await createClient();
  let query = supabase.from("notes").select(NOTE_SELECT, { count: "exact" }).order("created_at", { ascending: false }).range(from, from + PAGE_SIZE - 1);
  const term = q.replace(/[,()%*]/g, " ").trim();
  if (term) query = query.or(`title.ilike.%${term}%,description.ilike.%${term}%`);
  if (subject) query = query.eq("subject_id", subject);
  if (exam) query = query.eq("exam_id", exam);

  const [notes, subjects, exams] = await Promise.all([
    query,
    supabase.from("subjects").select("*").order("name"),
    supabase.from("exams").select("*").order("name"),
  ]);
  const list = (notes.data ?? []) as unknown as Note[];
  const total = notes.count ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const filtered = !!(term || subject || exam);
  const href = (p: number) => {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q); if (subject) sp.set("subject", subject); if (exam) sp.set("exam", exam);
    sp.set("page", String(p));
    return `/notes?${sp}`;
  };

  return (
    <div>
      <h1 className="mb-4 text-3xl font-extrabold tracking-tight">Notes</h1>
      <form className="mb-6 grid gap-2 sm:grid-cols-[1fr_11rem_11rem_auto]">
        <input name="q" defaultValue={q} placeholder="Search notes" className="field" />
        <select name="subject" defaultValue={subject} className="field">
          <option value="">All subjects</option>
          {(subjects.data as Subject[] | null)?.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select name="exam" defaultValue={exam} className="field">
          <option value="">All exams</option>
          {(exams.data as Exam[] | null)?.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
        </select>
        <button className="btn btn-primary">Search</button>
      </form>
      {filtered && <p className="mb-3 text-sm text-slate-600">{total} result{total !== 1 && "s"} <Link href="/notes" className="ml-2 text-brand underline">Clear filters</Link></p>}
      {list.length === 0 ? <Empty>{filtered ? "No notes match your search." : "No notes available yet."}</Empty> : (
        <ul className="border-t border-slate-200">{list.map((n) => <NoteRow key={n.id} note={n} />)}</ul>
      )}
      {pages > 1 && (
        <nav className="mt-6 flex items-center justify-between" aria-label="Pagination">
          {current > 1 ? <Link href={href(current - 1)} className="btn btn-outline">Previous</Link> : <span />}
          <span className="text-sm text-slate-600">Page {current} of {pages}</span>
          {current < pages ? <Link href={href(current + 1)} className="btn btn-outline">Next</Link> : <span />}
        </nav>
      )}
    </div>
  );
}
