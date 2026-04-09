import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Navbar } from "@/components/Navbar";

/**
 * Layout admin — réservé au rôle ADMIN.
 * Permet de gérer les propriétaires et leurs espaces sans passer par
 * le flow d'auto-inscription.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/signin");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar userRole="admin" userName={session.user.name ?? undefined} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
