import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-12">
      <h1 className="text-3xl font-extrabold tracking-tight">Page not found</h1>
      <p className="mt-2 text-slate-600">This page or note doesn't exist, or it was removed.</p>
      <Link href="/notes" className="btn btn-primary mt-5">Browse notes</Link>
    </div>
  );
}
