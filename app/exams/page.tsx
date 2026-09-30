import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Subject } from "@/lib/types";
import Empty from "@/components/Empty";

export default async function Page() {
  const supabase = await createClient();
  const { data } = await supabase.from("exams").select("*").order("name");
  const items = (data ?? []) as Subject[];
  return (
    <div>
      <h1 className="mb-4 text-3xl font-extrabold tracking-tight">Exams</h1>
      {items.length === 0 ? <Empty>No exams yet.</Empty> : (
        <ul className="border-t border-slate-200">
          {items.map((i) => (
            <li key={i.id} className="border-b border-slate-200 py-4">
              <Link href={`/exams/${i.slug}`} className="font-semibold hover:text-brand">{i.name}</Link>
              {i.description && <p className="mt-1 text-sm text-slate-600">{i.description}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
