import Link from "next/link";
import type { Note } from "@/lib/types";
import { downloadUrl, viewUrl } from "@/lib/utils";

export default function NoteRow({ note }: { note: Note }) {
  return (
    <li className="flex flex-col gap-3 border-b border-slate-200 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <Link href={`/notes/${note.id}`} className="font-semibold hover:text-brand">{note.title}</Link>
        <div className="mt-2 flex flex-wrap gap-2">
          {note.subject && <span className="chip">{note.subject.name}</span>}
          {note.exam && <span className="chip">{note.exam.name}</span>}
        </div>
      </div>
      <div className="flex gap-2">
        <a href={viewUrl(note.pdf_path)} target="_blank" rel="noopener" className="btn btn-outline">View</a>
        <a href={downloadUrl(note.pdf_path, note.title)} className="btn btn-primary">Download</a>
      </div>
    </li>
  );
}
