import Link from "next/link";
import type { Review } from "@/lib/types";
import { deleteMyReview, saveReview } from "@/app/actions";
import Empty from "./Empty";

const stars = (n: number) => "★".repeat(n) + "☆".repeat(5 - n);

export default function Reviews({ noteId, reviews, userId }: { noteId: string; reviews: Review[]; userId: string | null }) {
  const mine = reviews.find((r) => r.user_id === userId);
  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null;
  return (
    <section className="mt-10">
      <h2 className="h2">Reviews{avg && <span className="ml-2 text-base font-normal text-slate-500">{avg} / 5 from {reviews.length}</span>}</h2>

      {userId ? (
        <form action={saveReview} className="mb-6 space-y-3 rounded-md border border-slate-200 p-4">
          <input type="hidden" name="note_id" value={noteId} />
          <label className="block text-sm font-medium">Rating
            <select name="rating" defaultValue={mine?.rating ?? 5} className="field mt-1 sm:w-32">
              {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} star{n > 1 && "s"}</option>)}
            </select>
          </label>
          <textarea name="comment" defaultValue={mine?.comment ?? ""} maxLength={1000} rows={3} placeholder="Write a comment (optional)" className="field" />
          <button className="btn btn-primary">{mine ? "Update review" : "Post review"}</button>
        </form>
      ) : (
        <p className="mb-6 text-sm">
          <Link href={`/login?next=/notes/${noteId}`} className="font-semibold text-brand underline">Log in</Link> to leave a review.
        </p>
      )}

      {reviews.length === 0 ? <Empty>No reviews yet.</Empty> : (
        <ul className="space-y-4">
          {reviews.map((r) => (
            <li key={r.id} className="border-b border-slate-200 pb-4">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold">{r.author_name} <span className="ml-2 text-amber-600">{stars(r.rating)}</span></p>
                {r.user_id === userId && (
                  <form action={deleteMyReview}>
                    <input type="hidden" name="review_id" value={r.id} />
                    <input type="hidden" name="note_id" value={noteId} />
                    <button className="text-sm text-red-700 underline">Delete</button>
                  </form>
                )}
              </div>
              {r.comment && <p className="mt-1 whitespace-pre-wrap text-slate-700">{r.comment}</p>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
