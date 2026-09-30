import { createClient } from "@/lib/supabase/server";
import NoteForm from "@/components/admin/NoteForm";
import type { Exam, Subject } from "@/lib/types";

export default async function NewNote() {
  const supabase = await createClient();
  const [s, e] = await Promise.all([supabase.from("subjects").select("*").order("name"), supabase.from("exams").select("*").order("name")]);
  return <NoteForm subjects={(s.data ?? []) as Subject[]} exams={(e.data ?? []) as Exam[]} />;
}
