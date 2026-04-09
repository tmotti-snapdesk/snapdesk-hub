import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Navbar } from "@/components/Navbar";

/**
 * Layout BizDev — réservé au rôle BIZDEV (commerciaux Snapdesk).
 * La garde est faite côté proxy, mais on double-check ici pour être safe.
 */
export default async function BizdevLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "BIZDEV") {
    redirect("/signin");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar userRole="bizdev" userName={session.user.name ?? undefined} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
