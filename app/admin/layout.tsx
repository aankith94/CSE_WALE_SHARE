import Link from "next/link";
import { requireAdmin } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div>
      <nav className="mb-8 flex flex-wrap gap-2 border-b border-slate-200 pb-4">
        {["notes", "subjects", "exams", "videos", "reviews"].map((s) => (
          <Link key={s} href={`/admin/${s}`} className="btn btn-outline capitalize">{s}</Link>
        ))}
      </nav>
      {children}
    </div>
  );
}
