"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { unstable_cache, revalidateTag, revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { Locale } from "@/lib/translations";

// Helper to format number to "1.250.000" style
const formatNumber = (num: number) => {
  return num.toLocaleString("id-ID").replace(/,/g, ".");
};

// Helper to format date into "DD MMM YYYY" e.g., "12 Des 2026" or "12 Dec 2026"
const formatGoalDateShort = (date: Date, locale: Locale) => {
  const indonesianMonths = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];
  const englishMonths = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const months = locale === "en" ? englishMonths : indonesianMonths;
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

const getCachedGoalsData = unstable_cache(
  async (userId: string, locale: Locale) => {
    try {
      const goals = await prisma.goal.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });

      let sumTerkumpul = 0;
      let sumTarget = 0;

      const mappedGoals = goals.map((goal) => {
        sumTerkumpul += goal.terkumpul;
        sumTarget += goal.target;

        const persen =
          goal.target > 0
            ? Math.min(100, Math.round((goal.terkumpul / goal.target) * 100))
            : 0;

        const warnaBackground = goal.warnaBackground;

        return {
          id: goal.id,
          nama: goal.nama,
          icon: goal.icon || "🎯",
          target: `Rp ${formatNumber(goal.target)}`,
          terkumpul: `Rp ${formatNumber(goal.terkumpul)}`,
          persen,
          tenggatWaktu: formatGoalDateShort(goal.tenggatWaktu, locale),
          warnaBackground,
          motivasi:
            goal.motivasi ||
            (locale === "en"
              ? "Let's save slowly for your dream! ✨"
              : "Ayo menabung pelan-pelan untuk impianmu! ✨"),
        };
      });

      const totalPersen =
        sumTarget > 0
          ? Math.min(100, Math.round((sumTerkumpul / sumTarget) * 100))
          : 0;

      return {
        totalTerkumpul: `Rp ${formatNumber(sumTerkumpul)}`,
        totalTarget: `Rp ${formatNumber(sumTarget)}`,
        persen: totalPersen,
        goals: mappedGoals,
      };
    } catch (error) {
      console.error("Error fetching goals data:", error);
      return {
        totalTerkumpul: "Rp 0",
        totalTarget: "Rp 0",
        persen: 0,
        goals: [],
      };
    }
  },
  ["goals-data-list"],
  { tags: ["goals"] }
);

export async function getGoalsData() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return {
      totalTerkumpul: "Rp 0",
      totalTarget: "Rp 0",
      persen: 0,
      goals: [],
    };
  }
  const cookieStore = await cookies();
  const locale = (cookieStore.get("app_locale")?.value as Locale) || "id";
  return getCachedGoalsData(session.user.id, locale);
}

const getCachedGoalById = unstable_cache(
  async (userId: string, id: string) => {
    try {
      const goal = await prisma.goal.findUnique({
        where: { id },
      });

      if (!goal || goal.userId !== userId) {
        return null;
      }

      return {
        id: goal.id,
        nama: goal.nama,
        icon: goal.icon,
        target: goal.target,
        terkumpul: goal.terkumpul,
        warnaBackground: goal.warnaBackground,
        tenggatWaktu: goal.tenggatWaktu.toISOString().split("T")[0],
        motivasi: goal.motivasi || "",
      };
    } catch (error) {
      console.error("Error fetching goal by id:", error);
      return null;
    }
  },
  ["goal-by-id"],
  { tags: ["goals"] }
);

export async function getGoalById(id: string) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return null;
  }
  return getCachedGoalById(session.user.id, id);
}

// REVALIDATE EXPORTS
export async function revalidateGoals(id?: string) {
  await revalidateTag("goals", "max");
  await revalidateTag("dashboard", "max");

  await revalidatePath("/goals");
  await revalidatePath("/");
  await revalidatePath("/transaksi");

  if (id) {
    await revalidatePath(`/goals/edit/${id}`);
  }
}
