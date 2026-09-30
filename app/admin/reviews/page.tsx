import ConfirmButton from "@/components/admin/ConfirmButton";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteRow } from "@/app/admin/actions";

type Row = { id: string; note_id: string; author_name: string; rating: number; comment: string | null; note: { title: string } | null };

export default async function AdminReviews() {
  const supabase = await createClient();
  const { data } = await supabase.from("reviews").select("id,note_id,author_name,rating,comment,note:notes(title)").order("created_at", { ascending: false }).limit(200);
  const rows = (data ?? []) as unknown as Row[];
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Reviews</h1>
      {rows.length === 0 && <p className="text-slate-500">No reviews yet.</p>}
      <ul>
        {rows.map((r) => (
          <li key={r.id} className="flex items-start justify-between gap-3 border-b border-slate-200 py-3">
            <div className="min-w-0">
              <p className="font-semibold">{r.author_name}, {r.rating}/5 on <Link href={`/notes/${r.note_id}`} className="underline">{r.note?.title}</Link></p>
              {r.comment && <p className="mt-1 whitespace-pre-wrap text-slate-700">{r.comment}</p>}
            </div>
            <form action={deleteRow}>
              <input type="hidden" name="table" value="reviews" /><input type="hidden" name="id" value={r.id} />
              <ConfirmButton />
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
