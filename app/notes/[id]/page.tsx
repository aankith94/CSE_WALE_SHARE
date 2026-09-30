import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/auth";
import { NOTE_SELECT, type Note, type Review, type Video } from "@/lib/types";
import { downloadUrl, viewUrl, youtubeId } from "@/lib/utils";
import Reviews from "@/components/Reviews";

export default async function NoteDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("notes").select(NOTE_SELECT).eq("id", id).maybeSingle();
  if (!data) notFound();
  const note = data as unknown as Note;

  const [{ user }, reviews, videos] = await Promise.all([
    getSession(),
    supabase.from("reviews").select("*").eq("note_id", id).order("created_at", { ascending: false }),
    supabase.from("youtube_videos").select("*").eq("note_id", id),
  ]);

  return (
    <article>
      <h1 className="text-3xl font-extrabold tracking-tight">{note.title}</h1>
      <div className="mt-3 flex flex-wrap gap-2">
        {note.subject && <Link href={`/subjects/${note.subject.slug}`} className="chip">{note.subject.name}</Link>}
        {note.exam && <Link href={`/exams/${note.exam.slug}`} className="chip">{note.exam.name}</Link>}
      </div>
      {note.description && <p className="mt-4 max-w-2xl whitespace-pre-wrap text-slate-700">{note.description}</p>}

      <div className="mt-6 flex flex-wrap gap-3">
        <a href={viewUrl(note.pdf_path)} target="_blank" rel="noopener" className="btn btn-outline">Open PDF</a>
        <a href={downloadUrl(note.pdf_path, note.title)} className="btn btn-primary">Download PDF</a>
      </div>

      {/* Inline viewer on larger screens; phones use the Open PDF button (mobile browsers embed PDFs poorly) */}
      <iframe src={viewUrl(note.pdf_path)} title={note.title} className="mt-6 hidden h-[80vh] w-full rounded-md border border-slate-200 md:block" />

      {(videos.data as Video[] | null)?.map((v) => {
        const vid = youtubeId(v.youtube_url);
        return (
          <a key={v.id} href={v.youtube_url} target="_blank" rel="noopener" className="mt-8 flex max-w-md items-center gap-3">
            {vid && <img src={`https://i.ytimg.com/vi/${vid}/mqdefault.jpg`} alt="" className="w-32 rounded" loading="lazy" />}
            <span className="font-semibold">Watch the video: {v.title}</span>
          </a>
        );
      })}

      <Reviews noteId={note.id} reviews={(reviews.data ?? []) as Review[]} userId={user?.id ?? null} />
    </article>
  );
}
