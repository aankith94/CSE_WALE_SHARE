"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="py-12">
      <h1 className="text-3xl font-extrabold tracking-tight">Something went wrong</h1>
      <p className="mt-2 text-slate-600">Please try again. If it keeps happening, come back in a few minutes.</p>
      <button onClick={reset} className="btn btn-primary mt-5">Try again</button>
    </div>
  );
}
