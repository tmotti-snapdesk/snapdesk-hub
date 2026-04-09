import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Navbar } from "@/components/Navbar";

/**
 * Layout propriétaire — Server Component.
 * La protection par rôle est faite dans src/middleware.ts, mais on
 * récupère la session ici pour l'afficher dans la navbar.
 */
export default async function ProprietaireLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "OWNER") {
    redirect("/signin");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar userRole="proprietaire" userName={session.user.name ?? undefined} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
