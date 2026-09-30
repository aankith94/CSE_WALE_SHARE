import { createClient } from "@/lib/supabase/server";
import type { Video } from "@/lib/types";
import { YOUTUBE_CHANNEL, youtubeId } from "@/lib/utils";
import Empty from "@/components/Empty";

export default async function YouTubePage() {
  const supabase = await createClient();
  const { data } = await supabase.from("youtube_videos").select("*").order("created_at", { ascending: false });
  const videos = (data ?? []) as Video[];
  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight">YouTube</h1>
      <a href={YOUTUBE_CHANNEL} target="_blank" rel="noopener" className="btn btn-primary mt-4">Open CSE WALE on YouTube</a>
      <div className="mt-8">
        {videos.length === 0 ? <Empty>No videos added yet.</Empty> : (
          <ul className="grid gap-6 sm:grid-cols-2">
            {videos.map((v) => {
              const id = youtubeId(v.youtube_url);
              return (
                <li key={v.id}>
                  <a href={v.youtube_url} target="_blank" rel="noopener">
                    {id && <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" className="w-full rounded" loading="lazy" />}
                    <p className="mt-2 font-semibold">{v.title}</p>
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
