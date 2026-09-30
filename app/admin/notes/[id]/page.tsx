import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import NoteForm from "@/components/admin/NoteForm";
import { NOTE_SELECT, type Exam, type Note, type Subject } from "@/lib/types";

export default async function EditNote({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const [n, s, e] = await Promise.all([
    supabase.from("notes").select(NOTE_SELECT).eq("id", id).maybeSingle(),
    supabase.from("subjects").select("*").order("name"),
    supabase.from("exams").select("*").order("name"),
  ]);
  if (!n.data) notFound();
  return <NoteForm note={n.data as unknown as Note} subjects={(s.data ?? []) as Subject[]} exams={(e.data ?? []) as Exam[]} />;
}
