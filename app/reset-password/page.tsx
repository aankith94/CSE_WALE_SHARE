import Link from "next/link";
import ResetForm from "@/components/ResetForm";
import { getSession } from "@/lib/auth";

export default async function ResetPage() {
  const { user } = await getSession();
  if (!user) return <p>This reset link has expired. <Link href="/login" className="text-brand underline">Request a new one</Link>.</p>;
  return <ResetForm />;
}
