import ConfirmButton from "@/components/admin/ConfirmButton";
import { createClient } from "@/lib/supabase/server";
import { deleteRow, saveVideo } from "@/app/admin/actions";
import type { Video } from "@/lib/types";

export default async function AdminVideos() {
  const supabase = await createClient();
  const [v, n] = await Promise.all([
    supabase.from("youtube_videos").select("*").order("created_at", { ascending: false }),
    supabase.from("notes").select("id,title").order("title"),
  ]);
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">YouTube videos</h1>
      <form action={saveVideo} className="mb-8 grid max-w-xl gap-2">
        <input name="title" placeholder="Video title" required className="field" />
        <input name="youtube_url" type="url" placeholder="https://www.youtube.com/watch?v=..." required className="field" />
        <select name="note_id" className="field">
          <option value="">Not linked to a note</option>
          {n.data?.map((x) => <option key={x.id} value={x.id}>{x.title}</option>)}
        </select>
        <button className="btn btn-primary">Add video</button>
      </form>
      {!v.data?.length && <p className="text-slate-500">No videos yet.</p>}
      <ul>
        {(v.data as Video[] | null)?.map((x) => (
          <li key={x.id} className="flex items-center justify-between gap-3 border-b border-slate-200 py-3">
            <a href={x.youtube_url} target="_blank" rel="noopener" className="min-w-0 truncate font-semibold">{x.title}</a>
            <form action={deleteRow}>
              <input type="hidden" name="table" value="youtube_videos" /><input type="hidden" name="id" value={x.id} />
              <ConfirmButton />
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
