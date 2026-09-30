import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NOTE_SELECT, type Note, type Subject } from "@/lib/types";
import NoteRow from "@/components/NoteRow";
import Empty from "@/components/Empty";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("exams").select("*").eq("slug", slug).maybeSingle();
  if (!data) notFound();
  const item = data as Subject;
  const { data: notes } = await supabase.from("notes").select(NOTE_SELECT).eq("exam_id", item.id).order("created_at", { ascending: false });
  const list = (notes ?? []) as unknown as Note[];
  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight">{item.name}</h1>
      {item.description && <p className="mt-2 max-w-2xl text-slate-700">{item.description}</p>}
      <div className="mt-6">
        {list.length === 0 ? <Empty>No notes available yet.</Empty> : <ul className="border-t border-slate-200">{list.map((n) => <NoteRow key={n.id} note={n} />)}</ul>}
      </div>
    </div>
  );
}
