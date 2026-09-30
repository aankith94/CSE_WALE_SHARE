import { randomUUID } from "crypto";

export const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || randomUUID().slice(0, 8);

const PDF_BASE = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/notes/`;
export const viewUrl = (path: string) => PDF_BASE + path;
export const downloadUrl = (path: string, title: string) => {
  const name = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "notes";
  return `${PDF_BASE}${path}?download=${encodeURIComponent(name + ".pdf")}`;
};

export const youtubeId = (url: string) =>
  url.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/)?.[1] ?? null;

export const YOUTUBE_CHANNEL = process.env.NEXT_PUBLIC_YOUTUBE_URL || "https://www.youtube.com";
