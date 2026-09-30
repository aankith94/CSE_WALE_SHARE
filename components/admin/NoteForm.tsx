"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Exam, Note, Subject } from "@/lib/types";

// Uploads the PDF straight from the browser to Supabase Storage (RLS: admin only), then saves the note row.
export default function NoteForm({ note, subjects, exams }: { note?: Note; subjects: Subject[]; exams: Exam[] }) {
  const router = useRouter();
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  if (subjects.length === 0) {
    return <p>Add a <Link href="/admin/subjects" className="text-brand underline">subject</Link> first, then upload notes.</p>;
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true); setMsg("");
    const f = new FormData(e.currentTarget);
    const file = f.get("pdf") as File;
    const supabase = createClient();
    let pdf_path = note?.pdf_path;

    if (file && file.size > 0) {
      if (file.type !== "application/pdf") { setBusy(false); return setMsg("Please choose a PDF file."); }
      if (file.size > 50 * 1024 * 1024) { setBusy(false); return setMsg("PDF must be under 50 MB."); }
      const path = `${crypto.randomUUID()}.pdf`;
      const up = await supabase.storage.from("notes").upload(path, file, { contentType: "application/pdf" });
      if (up.error) { setBusy(false); return setMsg(up.error.message); }
      if (note?.pdf_path) await supabase.storage.from("notes").remove([note.pdf_path]);
      pdf_path = path;
    }
    if (!pdf_path) { setBusy(false); return setMsg("Choose a PDF to upload."); }

    const row = {
      title: String(f.get("title")).trim(),
      description: String(f.get("description")).trim() || null,
      subject_id: String(f.get("subject_id")),
      exam_id: String(f.get("exam_id")) || null,
      pdf_path,
      updated_at: new Date().toISOString(),
    };
    const { error } = note ? await supabase.from("notes").update(row).eq("id", note.id) : await supabase.from("notes").insert(row);
    setBusy(false);
    if (error) return setMsg(error.message);
    router.push("/admin/notes");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="max-w-xl space-y-3">
      <h1 className="text-2xl font-bold">{note ? "Edit note" : "Upload note"}</h1>
      <input name="title" defaultValue={note?.title} placeholder="Title" required className="field" />
      <textarea name="description" defaultValue={note?.description ?? ""} placeholder="Description" rows={4} className="field" />
      <select name="subject_id" defaultValue={note?.subject_id ?? ""} required className="field">
        <option value="" disabled>Choose subject</option>
        {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
      </select>
      <select name="exam_id" defaultValue={note?.exam_id ?? ""} className="field">
        <option value="">No exam</option>
        {exams.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
      </select>
      <label className="block text-sm font-medium">
        PDF {note && <span className="font-normal text-slate-500">(leave empty to keep the current file)</span>}
        <input name="pdf" type="file" accept="application/pdf" className="field mt-1" />
      </label>
      {msg && <p className="text-sm text-red-700">{msg}</p>}
      <button disabled={busy} className="btn btn-primary">{busy ? "Saving..." : "Save note"}</button>
    </form>
  );
}
