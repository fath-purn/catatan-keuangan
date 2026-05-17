"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { startOfMonth, endOfMonth, subDays } from "date-fns";
import { unstable_cache } from "next/cache";

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
  { tags: ["goals"] }
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
            hari: indonesianDays[dateObj.getDay()],
            bulan: indonesianMonthsFull[dateObj.getMonth()],
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
  { tags: ["transactions"] }
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
  return getCachedTransactionsData(session.user.id, JSON.stringify(options || {}));
}

const getCachedDashboardData = unstable_cache(
  async (userId: string) => {
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
            return `Rp ${formatted.endsWith(".0") ? formatted.slice(0, -2) : formatted}jt`;
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
      const recentTransactionsGrouped = await getTransactionsData();

      return {
        name: user?.name || "Kakak Cantik",
        avatar: user?.avatar,
        dompet: {
          saldo: `Rp ${formatNumber(totalSaldo)}`,
          pendapatan: `Rp ${formatNumber(totalPendapatanMonth)}`,
          pengeluaran: `Rp ${formatNumber(totalPengeluaranMonth)}`,
          hasil: totalSaldo >= 0,
        },
        goals: goalData,
        transaksi: recentTransactionsGrouped.slice(0, 3), // return up to 3 date groups
      };
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
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
      };
    }
  },
  ["dashboard-data"],
  { tags: ["dashboard"] }
);

// Fetch general dashboard statistics (saldo, total pendapatan, pengeluaran, goals, latest transaction)
export async function getDashboardData() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return {
      dompet: {
        saldo: "Rp 0",
        pendapatan: "Rp 0",
        pengeluaran: "Rp 0",
        hasil: false,
      },
      goals: null,
      transaksi: [],
    };
  }
  return getCachedDashboardData(session.user.id);
}
