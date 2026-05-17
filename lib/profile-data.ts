"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { unstable_cache } from "next/cache";

const getCachedProfileData = unstable_cache(
  async (userId: string) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          avatar: true,
          targetGayaHidup: true,
          email: true,
        },
      });

      if (!user) return null;

      // Format targetGayaHidup to Indonesian number style (e.g. 5.000.000)
      const formattedTarget = user.targetGayaHidup
        .toLocaleString("id-ID")
        .replace(/,/g, ".");

      return {
        id: user.id,
        nama: user.name || "Kakak Cantik",
        icon: user.avatar || "👦🏻",
        targetGayaHidup: formattedTarget,
        rawTargetGayaHidup: user.targetGayaHidup,
        email: user.email,
      };
    } catch (error) {
      console.error("Error fetching profile data:", error);
      return null;
    }
  },
  ["profile-data"],
  { tags: ["profile"] },
);

export async function getProfileData() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return null;
  }
  return getCachedProfileData(session.user.id);
}
