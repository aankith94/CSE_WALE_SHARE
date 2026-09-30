"use client";

export default function ConfirmButton({ label = "Delete", message = "Delete this permanently?" }: { label?: string; message?: string }) {
  return <button className="btn btn-danger" onClick={(e) => { if (!confirm(message)) e.preventDefault(); }}>{label}</button>;
}
