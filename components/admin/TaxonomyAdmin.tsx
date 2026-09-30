import ConfirmButton from "@/components/admin/ConfirmButton";
import { createClient } from "@/lib/supabase/server";
import { deleteRow, saveTaxonomy } from "@/app/admin/actions";
import type { Subject } from "@/lib/types";

export default async function TaxonomyAdmin({ table, label }: { table: "subjects" | "exams"; label: string }) {
  const supabase = await createClient();
  const { data } = await supabase.from(table).select("*").order("name");
  const items = (data ?? []) as Subject[];
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">{label}s</h1>
      <form action={saveTaxonomy} className="mb-8 grid gap-2 sm:grid-cols-[1fr_2fr_auto]">
        <input type="hidden" name="table" value={table} />
        <input name="name" placeholder={`New ${label.toLowerCase()} name`} required className="field" />
        <input name="description" placeholder="Description (optional)" className="field" />
        <button className="btn btn-primary">Add {label.toLowerCase()}</button>
      </form>
      {items.length === 0 && <p className="text-slate-500">No {label.toLowerCase()}s yet.</p>}
      <ul className="space-y-3">
        {items.map((i) => (
          <li key={i.id} className="flex flex-col gap-2 border-b border-slate-200 pb-3 sm:flex-row">
            <form action={saveTaxonomy} className="grid flex-1 gap-2 sm:grid-cols-[1fr_2fr_auto]">
              <input type="hidden" name="table" value={table} />
              <input type="hidden" name="id" value={i.id} />
              <input name="name" defaultValue={i.name} required className="field" />
              <input name="description" defaultValue={i.description ?? ""} className="field" />
              <button className="btn btn-outline">Save</button>
            </form>
            <form action={deleteRow}>
              <input type="hidden" name="table" value={table} />
              <input type="hidden" name="id" value={i.id} />
              <ConfirmButton />
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
