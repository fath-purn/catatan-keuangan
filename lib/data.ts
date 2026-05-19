"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { startOfMonth, endOfMonth, subDays } from "date-fns";
import { unstable_cache, revalidateTag, revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { translations, Locale } from "@/lib/translations";

const indonesianDays = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];
const indonesianMonthsFull = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const englishDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const englishMonthsFull = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Helper to format number to "1.250.000" style
const formatNumber = (num: number) => {
  return num.toLocaleString("id-ID").replace(/,/g, ".");
};

const getCachedUserGoals = unstable_cache(
  async (userId: string) => {
    try {
      const goals = await prisma.goal.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });

      return goals.map((goal) => ({
        id: goal.id,
        label: goal.nama,
        icon: goal.icon || "🎯",
        target: goal.target,
        terkumpul: goal.terkumpul,
        warnaBackground: goal.warnaBackground,
      }));
    } catch (error) {
      console.error("Error fetching user goals:", error);
      return [];
    }
  },
  ["user-goals"],
  { tags: ["goals"] },
);

// Fetch user's active goals for form select options
export async function getUserGoals() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return [];
  }
  return getCachedUserGoals(session.user.id);
}

const getCachedTransactionsData = unstable_cache(
  async (userId: string, optionsStr: string) => {
    const options = JSON.parse(optionsStr);
    const locale = (options?.locale || "id") as Locale;
    const days = locale === "en" ? englishDays : indonesianDays;
    const months = locale === "en" ? englishMonthsFull : indonesianMonthsFull;

    const search = options?.search;
    const jenis = options?.jenis;
    const bulan = options?.bulan;
    const tahun = options?.tahun;
    const kategori = options?.kategori;
    const keperluan = options?.keperluan;
    const mood = options?.mood;
    const sort = options?.sort || "terbaru";

    try {
      const whereClause: any = {
        userId,
      };

      // 1. Search query filter
      if (search) {
        whereClause.judul = {
          contains: search,
          mode: "insensitive",
        };
      }

      // 2. Jenis transaksi filter
      if (jenis === "Pemasukan") {
        whereClause.jenis_transaksi = true;
      } else if (jenis === "Pengeluaran") {
        whereClause.jenis_transaksi = false;
      }

      // 3. Waktu filter (Bulan & Tahun)
      if (bulan && tahun) {
        const b = parseInt(bulan, 10);
        const t = parseInt(tahun, 10);
        whereClause.tanggal = {
          gte: new Date(t, b - 1, 1),
          lte: new Date(t, b, 0, 23, 59, 59, 999),
        };
      } else if (tahun) {
        const t = parseInt(tahun, 10);
        whereClause.tanggal = {
          gte: new Date(t, 0, 1),
          lte: new Date(t, 11, 31, 23, 59, 59, 999),
        };
      }

      // 4. Kategori filter
      if (kategori) {
        whereClause.kategori = kategori;
      }

      // 5. Keperluan filter
      if (keperluan) {
        whereClause.keperluan = keperluan;
      }

      // 6. Mood filter
      if (mood) {
        whereClause.mood = mood;
      }

      // 7. Sorting
      let orderBy: any = [{ tanggal: "desc" }, { waktu: "desc" }];
      if (sort === "terlama") {
        orderBy = [{ tanggal: "asc" }, { waktu: "asc" }];
      } else if (sort === "tertinggi") {
        orderBy = { nominal: "desc" };
      } else if (sort === "terendah") {
        orderBy = { nominal: "asc" };
      }

      const transactions = await prisma.transaction.findMany({
        where: whereClause,
        orderBy,
        include: {
          goal: true,
        },
      });

      // Grouping by Date (Year, Month, Date string key)
      const groups: {
        [key: string]: {
          id: string;
          tanggal: string;
          hari: string;
          bulan: string;
          tahun: string;
          totalPendapatan: number;
          totalPengeluaran: number;
          data: any[];
          timestamp: number; // to sort groups afterwards
        };
      } = {};

      transactions.forEach((trx) => {
        const dateObj = new Date(trx.tanggal);
        const dateKey = `${dateObj.getFullYear()}-${dateObj.getMonth()}-${dateObj.getDate()}`;

        if (!groups[dateKey]) {
          groups[dateKey] = {
            id: dateKey,
            tanggal: dateObj.getDate().toString(),
            hari: days[dateObj.getDay()],
            bulan: months[dateObj.getMonth()],
            tahun: dateObj.getFullYear().toString(),
            totalPendapatan: 0,
            totalPengeluaran: 0,
            data: [],
            timestamp: dateObj.getTime(),
          };
        }

        if (trx.jenis_transaksi) {
          groups[dateKey].totalPendapatan += trx.nominal;
        } else {
          groups[dateKey].totalPengeluaran += trx.nominal;
        }

        groups[dateKey].data.push({
          id: trx.id,
          jenis: trx.judul,
          nominal: formatNumber(trx.nominal),
          rawNominal: trx.nominal,
          waktu: trx.waktu,
          kategori: trx.kategori,
          aset: trx.aset,
          mood: trx.mood,
          keperluan: trx.keperluan,
          jenis_transaksi: trx.jenis_transaksi,
          goalId: trx.goalId,
          goalName: trx.goal?.nama || null,
          tanggalRaw: trx.tanggal.toISOString().split("T")[0],
        });
      });

      // Sort grouped array
      const sortedGroups = Object.values(groups).sort((a, b) => {
        if (sort === "terlama") {
          return a.timestamp - b.timestamp;
        }
        return b.timestamp - a.timestamp;
      });

      return sortedGroups.map((group) => ({
        id: group.id,
        tanggal: group.tanggal,
        hari: group.hari,
        bulan: group.bulan,
        tahun: group.tahun,
        totalPendapatan: formatNumber(group.totalPendapatan),
        totalPengeluaran: formatNumber(group.totalPengeluaran),
        data: group.data,
      }));
    } catch (error) {
      console.error("Error fetching transactions data:", error);
      return [];
    }
  },
  ["transactions-data"],
  { tags: ["transactions"] },
);

// Fetch transactions with filtering and grouping by date
export async function getTransactionsData(options?: {
  search?: string;
  jenis?: string; // "Semua", "Pemasukan", "Pengeluaran"
  bulan?: string; // "1" - "12"
  tahun?: string; // e.g. "2026"
  kategori?: string;
  keperluan?: string;
  mood?: string;
  sort?: string; // "terbaru", "terlama", "tertinggi", "terendah"
}) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return [];
  }
  const cookieStore = await cookies();
  const locale = (cookieStore.get("app_locale")?.value || "id") as Locale;

  return getCachedTransactionsData(
    session.user.id,
    JSON.stringify({ ...(options || {}), locale }),
  );
}

const getCachedDashboardData = unstable_cache(
  async (userId: string, locale: Locale) => {
    try {
      // 1. Fetch user custom targetGayaHidup
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      // 2. Fetch all transactions to compute total asset balance
      const allTrx = await prisma.transaction.findMany({
        where: { userId },
      });

      let totalPendapatanAll = 0;
      let totalPengeluaranAll = 0;

      allTrx.forEach((t) => {
        if (t.jenis_transaksi) totalPendapatanAll += t.nominal;
        else totalPengeluaranAll += t.nominal;
      });

      const totalSaldo = totalPendapatanAll - totalPengeluaranAll;

      // 3. Fetch current month income & expenses
      const startMonth = startOfMonth(new Date());
      const endMonth = endOfMonth(new Date());

      const monthTrx = await prisma.transaction.findMany({
        where: {
          userId,
          tanggal: {
            gte: startMonth,
            lte: endMonth,
          },
        },
      });

      let totalPendapatanMonth = 0;
      let totalPengeluaranMonth = 0;

      monthTrx.forEach((t) => {
        if (t.jenis_transaksi) totalPendapatanMonth += t.nominal;
        else totalPengeluaranMonth += t.nominal;
      });

      // 4. Fetch the latest Goal
      const latestGoal = await prisma.goal.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });

      let goalData = null;
      if (latestGoal) {
        const persenVal =
          latestGoal.target > 0
            ? Math.min(
                100,
                Math.round((latestGoal.terkumpul / latestGoal.target) * 100),
              )
            : 0;
        // format target as e.g. "Rp 25jt" or full "Rp 25.000.000"
        const formatGoalAmount = (val: number) => {
          if (val >= 1000000) {
            const formatted = (val / 1000000).toFixed(1);
            const suffix = locale === "en" ? "m" : "jt";
            return `Rp ${formatted.endsWith(".0") ? formatted.slice(0, -2) : formatted}${suffix}`;
          }
          return `Rp ${formatNumber(val)}`;
        };

        goalData = {
          id: latestGoal.id,
          nama: latestGoal.nama,
          icon: latestGoal.icon,
          persen: persenVal,
          terkumpul: formatGoalAmount(latestGoal.terkumpul),
          target: formatGoalAmount(latestGoal.target),
          warnaBackground: latestGoal.warnaBackground,
        };
      }

      // 5. Get latest grouped transactions
      const recentTransactionsGrouped = await getCachedTransactionsData(
        userId,
        JSON.stringify({ locale }),
      );

      // 6. Dynamic Smart Notifications
      const notifications = [];
      const limitGayaHidup = user?.targetGayaHidup || 5000000;
      const persenPengeluaran =
        limitGayaHidup > 0 ? (totalPengeluaranMonth / limitGayaHidup) * 100 : 0;

      // SCENARIO 1: Overspending Target Gaya Hidup
      if (persenPengeluaran >= 100) {
        notifications.push({
          id: "overspending-critical",
          title: translations[locale].overspending_crit_title,
          message: translations[locale].overspending_crit_msg
            .replace("{expense}", formatNumber(totalPengeluaranMonth))
            .replace("{limit}", formatNumber(limitGayaHidup)),
          type: "danger",
        });
      } else if (persenPengeluaran >= 80) {
        notifications.push({
          id: "overspending-warning",
          title: translations[locale].overspending_warn_title,
          message: translations[locale].overspending_warn_msg
            .replace("{percent}", String(Math.round(persenPengeluaran)))
            .replace("{expense}", formatNumber(totalPengeluaranMonth))
            .replace("{limit}", formatNumber(limitGayaHidup)),
          type: "warning",
        });
      }

      // SCENARIO 2: Goal Milestones
      if (latestGoal) {
        const persenGoal =
          latestGoal.target > 0
            ? (latestGoal.terkumpul / latestGoal.target) * 100
            : 0;
        if (persenGoal >= 100) {
          notifications.push({
            id: `goal-complete-${latestGoal.id}`,
            title: translations[locale].goal_complete_title,
            message: translations[locale].goal_complete_msg
              .replace("{nama}", latestGoal.nama),
            type: "success",
          });
        } else if (persenGoal >= 85) {
          notifications.push({
            id: `goal-close-${latestGoal.id}`,
            title: translations[locale].goal_close_title,
            message: translations[locale].goal_close_msg
              .replace("{nama}", latestGoal.nama)
              .replace("{percent}", String(Math.round(persenGoal))),
            type: "info",
          });
        }
      }

      // SCENARIO 3: Impulsive Mood-Buying Check
      let totalMoodSpent = 0;
      monthTrx.forEach((t) => {
        if (
          !t.jenis_transaksi &&
          ["Sedih", "Marah", "Cemas", "Lelah", "Sad", "Angry", "Anxious", "Tired"].includes(t.mood || "") &&
          ["Jajan", "Belanja", "Hiburan", "Lainnya", "Food", "Shopping", "Entertainment", "Others"].includes(t.kategori || "")
        ) {
          totalMoodSpent += t.nominal;
        }
      });
      if (totalMoodSpent > 0) {
        notifications.push({
          id: "impulsive-mood-buying",
          title: translations[locale].mood_buying_title,
          message: translations[locale].mood_buying_msg
            .replace("{amount}", formatNumber(totalMoodSpent)),
          type: "warning",
        });
      }

      // SCENARIO 4: Giant Single Expense Warning
      let largestTrx: any = null;
      monthTrx.forEach((t) => {
        if (!t.jenis_transaksi) {
          if (!largestTrx || t.nominal > largestTrx.nominal) {
            largestTrx = t;
          }
        }
      });
      if (largestTrx && largestTrx.nominal >= 1500000) {
        notifications.push({
          id: `giant-expense-${largestTrx.id}`,
          title: translations[locale].giant_expense_title,
          message: translations[locale].giant_expense_msg
            .replace("{judul}", largestTrx.judul)
            .replace("{amount}", formatNumber(largestTrx.nominal)),
          type: "danger",
        });
      }

      // SCENARIO 5: Healthy Financial Cashflow vs Deficit
      if (totalPendapatanMonth > 0 && totalPengeluaranMonth > totalPendapatanMonth) {
        notifications.push({
          id: "cashflow-deficit",
          title: translations[locale].cashflow_deficit_title,
          message: translations[locale].cashflow_deficit_msg
            .replace("{expense}", formatNumber(totalPengeluaranMonth))
            .replace("{income}", formatNumber(totalPendapatanMonth))
            .replace("{deficit}", formatNumber(totalPengeluaranMonth - totalPendapatanMonth)),
          type: "danger",
        });
      } else if (totalPendapatanMonth > 0 && totalPengeluaranMonth > 0 && (totalPengeluaranMonth / totalPendapatanMonth) <= 0.4) {
        notifications.push({
          id: "super-saving-ratio",
          title: translations[locale].super_saving_title,
          message: translations[locale].super_saving_msg
            .replace("{percent}", String(Math.round((totalPengeluaranMonth / totalPendapatanMonth) * 100))),
          type: "success",
        });
      }

      // SCENARIO 6: Weekend Impulse/Reward Warning
      const currentDay = new Date().getDay(); // 0 is Sunday, 5 is Friday, 6 is Saturday
      if ([0, 5, 6].includes(currentDay)) {
        notifications.push({
          id: "weekend-spending-warning",
          title: translations[locale].weekend_warning_title,
          message: translations[locale].weekend_warning_msg,
          type: "info",
        });
      }

      // SCENARIO 7: General Finance Tip
      notifications.push({
        id: "daily-tip",
        title: translations[locale].tip_title,
        message: translations[locale].tip_msg,
        type: "tip",
      });

      return {
        name: user?.name || (locale === "en" ? "Dear User" : "Kakak Cantik"),
        avatar: user?.avatar,
        dompet: {
          saldo: `Rp ${formatNumber(totalSaldo)}`,
          pendapatan: `Rp ${formatNumber(totalPendapatanMonth)}`,
          pengeluaran: `Rp ${formatNumber(totalPengeluaranMonth)}`,
          hasil: totalSaldo >= 0,
        },
        goals: goalData,
        transaksi: recentTransactionsGrouped.slice(0, 3), // return up to 3 date groups
        notifications,
      };
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      return {
        name: locale === "en" ? "Dear User" : "Kakak Cantik",
        avatar: "👦🏻",
        dompet: {
          saldo: "Rp 0",
          pendapatan: "Rp 0",
          pengeluaran: "Rp 0",
          hasil: false,
        },
        goals: null,
        transaksi: [],
        notifications: [],
      };
    }
  },
  ["dashboard-data"],
  { tags: ["dashboard"] },
);

// Fetch general dashboard statistics (saldo, total pendapatan, pengeluaran, goals, latest transaction)
export async function getDashboardData() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return {
      name: "Kakak Cantik",
      avatar: "👦🏻",
      dompet: {
        saldo: "Rp 0",
        pendapatan: "Rp 0",
        pengeluaran: "Rp 0",
        hasil: false,
      },
      goals: null,
      transaksi: [],
      notifications: [],
    };
  }
  const cookieStore = await cookies();
  const locale = (cookieStore.get("app_locale")?.value as Locale) || "id";
  return getCachedDashboardData(session.user.id, locale);
}

// REVALIDATE EXPORTS
export async function revalidateTransactions() {
  await revalidateTag("transactions", "max");
  await revalidateTag("dashboard", "max");
  await revalidateTag("reports", "max");
  await revalidateTag("goals", "max");

  await revalidatePath("/transaksi");
  await revalidatePath("/");
  await revalidatePath("/laporan");
  await revalidatePath("/goals");
}
