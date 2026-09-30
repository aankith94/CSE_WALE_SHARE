import "./globals.css";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = { title: "CSE WALE Notes", description: "Free notes from the CSE WALE YouTube channel." };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin } = await getSession();
  return (
    <html lang="en">
      <head><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
      <body className="flex min-h-screen flex-col">
        <Header signedIn={!!user} isAdmin={isAdmin} />
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
