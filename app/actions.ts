"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function saveReview(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const noteId = String(formData.get("note_id"));
  const rating = Number(formData.get("rating"));
  const comment = String(formData.get("comment") ?? "").trim().slice(0, 1000);
  if (!(rating >= 1 && rating <= 5)) return;
  const { data: profile } = await supabase.from("users").select("display_name").eq("id", user.id).maybeSingle();
  const { error } = await supabase.from("reviews").upsert(
    { note_id: noteId, user_id: user.id, rating, comment, author_name: profile?.display_name ?? "Student", updated_at: new Date().toISOString() },
    { onConflict: "note_id,user_id" },
  );
  if (error) throw new Error(error.message);
  revalidatePath(`/notes/${noteId}`);
}

export async function deleteMyReview(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  await supabase.from("reviews").delete().eq("id", String(formData.get("review_id"))).eq("user_id", user.id);
  revalidatePath(`/notes/${String(formData.get("note_id"))}`);
}
