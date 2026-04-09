import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

/**
 * Version BizDev : liste tous les espaces de la plateforme (tous propriétaires)
 * avec les compteurs de visites et de rapports, pour alimenter le back-office.
 */
export async function listAllSpacesForBizdev() {
  const session = await auth();
  if (!session?.user || session.user.role !== "BIZDEV") {
    throw new Error("Non autorisé — rôle BIZDEV requis.");
  }

  return prisma.space.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      owner: { select: { id: true, name: true, company: true, email: true } },
      _count: {
        select: {
          visits: true,
          commercializationReports: true,
        },
      },
    },
  });
}

export type BizdevSpaceListItem = Awaited<
  ReturnType<typeof listAllSpacesForBizdev>
>[number];

export async function getSpaceForBizdev(spaceId: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "BIZDEV") {
    throw new Error("Non autorisé — rôle BIZDEV requis.");
  }

  return prisma.space.findUnique({
    where: { id: spaceId },
    include: {
      owner: { select: { id: true, name: true, company: true, email: true } },
      visits: {
        orderBy: { visitDate: "desc" },
        include: { createdBy: { select: { name: true } } },
      },
      marketingInvestments: {
        orderBy: { spentAt: "desc" },
      },
      commercializationReports: {
        orderBy: { month: "desc" },
      },
    },
  });
}

export type BizdevSpaceDetail = Awaited<
  ReturnType<typeof getSpaceForBizdev>
>;
