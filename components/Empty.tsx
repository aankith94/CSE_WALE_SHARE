export default function Empty({ children }: { children: React.ReactNode }) {
  return <p className="rounded-md border border-dashed border-slate-300 px-4 py-8 text-center text-slate-500">{children}</p>;
}
