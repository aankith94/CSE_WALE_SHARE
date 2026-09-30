"use server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

const DELETABLE = ["subjects", "exams", "youtube_videos", "reviews"];
const TAXONOMY = ["subjects", "exams"];
const done = () => revalidatePath("/", "layout");
const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();

export async function saveTaxonomy(f: FormData) {
  await requireAdmin();
  const table = str(f, "table"), id = str(f, "id"), name = str(f, "name");
  if (!TAXONOMY.includes(table) || !name) return;
  const row = { name, description: str(f, "description") || null };
  const supabase = await createClient();
  const { error } = id
    ? await supabase.from(table).update(row).eq("id", id)
    : await supabase.from(table).insert({ ...row, slug: slugify(name) });
  if (error) throw new Error(error.message);
  done();
}

export async function deleteRow(f: FormData) {
  await requireAdmin();
  const table = str(f, "table");
  if (!DELETABLE.includes(table)) return;
  const supabase = await createClient();
  const { error } = await supabase.from(table).delete().eq("id", str(f, "id"));
  if (error) throw new Error(error.message.includes("foreign key") ? "Delete or move this item's notes first." : error.message);
  done();
}

export async function deleteNote(f: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const id = str(f, "id");
  const { data } = await supabase.from("notes").select("pdf_path").eq("id", id).maybeSingle();
  const { error } = await supabase.from("notes").delete().eq("id", id);
  if (error) throw new Error(error.message);
  if (data?.pdf_path) await supabase.storage.from("notes").remove([data.pdf_path]);
  done();
}

export async function saveVideo(f: FormData) {
  await requireAdmin();
  const title = str(f, "title"), youtube_url = str(f, "youtube_url");
  if (!title || !youtube_url) return;
  const supabase = await createClient();
  const { error } = await supabase.from("youtube_videos").insert({ title, youtube_url, note_id: str(f, "note_id") || null });
  if (error) throw new Error(error.message);
  done();
}
