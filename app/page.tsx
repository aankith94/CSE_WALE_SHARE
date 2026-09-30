import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { NOTE_SELECT, type Exam, type Note, type Subject } from "@/lib/types";
import { YOUTUBE_CHANNEL } from "@/lib/utils";
import NoteRow from "@/components/NoteRow";
import Empty from "@/components/Empty";

export default async function Home() {
  const supabase = await createClient();
  const [notes, subjects, exams] = await Promise.all([
    supabase.from("notes").select(NOTE_SELECT).order("created_at", { ascending: false }).limit(6),
    supabase.from("subjects").select("*").order("name"),
    supabase.from("exams").select("*").order("name"),
  ]);
  const latest = (notes.data ?? []) as unknown as Note[];

  return (
    <div className="space-y-12">
      <section>
        <h1 className="text-4xl font-extrabold tracking-tight text-brand sm:text-5xl">CSE WALE</h1>
        <p className="mt-3 max-w-xl text-lg text-slate-700">
          Notes from the CSE WALE YouTube channel. Pick a subject, open the PDF, or download it.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/notes" className="btn btn-primary">Browse notes</Link>
          <a href={YOUTUBE_CHANNEL} target="_blank" rel="noopener" className="btn btn-outline">Watch on YouTube</a>
        </div>
      </section>

      <section>
        <h2 className="h2">Latest notes</h2>
        {latest.length === 0 ? <Empty>No notes available yet.</Empty> : (
          <ul className="border-t border-slate-200">{latest.map((n) => <NoteRow key={n.id} note={n} />)}</ul>
        )}
      </section>

      <section>
        <h2 className="h2">Subjects</h2>
        {!subjects.data?.length ? <Empty>No subjects yet.</Empty> : (
          <div className="flex flex-wrap gap-2">
            {(subjects.data as Subject[]).map((s) => <Link key={s.id} href={`/subjects/${s.slug}`} className="btn btn-outline">{s.name}</Link>)}
          </div>
        )}
      </section>

      <section>
        <h2 className="h2">Exams</h2>
        {!exams.data?.length ? <Empty>No exams yet.</Empty> : (
          <div className="flex flex-wrap gap-2">
            {(exams.data as Exam[]).map((e) => <Link key={e.id} href={`/exams/${e.slug}`} className="btn btn-outline">{e.name}</Link>)}
          </div>
        )}
      </section>
    </div>
  );
}
