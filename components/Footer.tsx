import { YOUTUBE_CHANNEL } from "@/lib/utils";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500">
      CSE WALE ·{" "}
      <a href={YOUTUBE_CHANNEL} target="_blank" rel="noopener" className="underline">YouTube</a>
    </footer>
  );
}
