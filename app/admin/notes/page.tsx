import ConfirmButton from "@/components/admin/ConfirmButton";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteNote } from "@/app/admin/actions";
import { NOTE_SELECT, type Note } from "@/lib/types";

export default async function AdminNotes() {
  const supabase = await createClient();
  const { data } = await supabase.from("notes").select(NOTE_SELECT).order("created_at", { ascending: false });
  const notes = (data ?? []) as unknown as Note[];
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notes</h1>
        <Link href="/admin/notes/new" className="btn btn-primary">Upload note</Link>
      </div>
      {notes.length === 0 && <p className="text-slate-500">No notes yet.</p>}
      <ul>
        {notes.map((n) => (
          <li key={n.id} className="flex items-center justify-between gap-3 border-b border-slate-200 py-3">
            <div className="min-w-0">
              <p className="truncate font-semibold">{n.title}</p>
              <p className="text-sm text-slate-500">{n.subject?.name}{n.exam ? `, ${n.exam.name}` : ""}</p>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/notes/${n.id}`} className="btn btn-outline">Edit</Link>
              <form action={deleteNote}><input type="hidden" name="id" value={n.id} /><ConfirmButton /></form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
