"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { startOfMonth, endOfMonth, addMonths, startOfWeek, endOfWeek, addWeeks } from "date-fns";
import { unstable_cache } from "next/cache";
import { cookies } from "next/headers";
import { Locale } from "@/lib/translations";

const getCachedMonthlyReport = unstable_cache(
  async (userId: string, offset: number, locale: Locale) => {
    const targetDate = addMonths(new Date(), offset);
    const start = startOfMonth(targetDate);
    const end = endOfMonth(targetDate);

    try {
      // Fetch all transactions in the target month for the logged-in user
      const transactions = await prisma.transaction.findMany({
        where: {
          userId,
          tanggal: {
            gte: start,
            lte: end,
          },
        },
      });

      const indonesianMonths = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
      ];
      const englishMonths = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      const months = locale === "en" ? englishMonths : indonesianMonths;
      
      const periode = `${months[targetDate.getMonth()]} ${targetDate.getFullYear()}`;

      // Initialize weekly metrics
      let totalPemasukan = 0;
      let totalPengeluaran = 0;

      const weeklyData = [
        { minggu: locale === "en" ? "Wk 1" : "Mg 1", pengeluaran: 0, pemasukan: 0 },
        { minggu: locale === "en" ? "Wk 2" : "Mg 2", pengeluaran: 0, pemasukan: 0 },
        { minggu: locale === "en" ? "Wk 3" : "Mg 3", pengeluaran: 0, pemasukan: 0 },
        { minggu: locale === "en" ? "Wk 4" : "Mg 4", pengeluaran: 0, pemasukan: 0 },
      ];

      // Initialize category totals
      const categoryTotals: { [key: string]: number } = {};
      const incomeCategoryTotals: { [key: string]: number } = {};

      transactions.forEach((tx) => {
        const day = new Date(tx.tanggal).getDate();
        const amount = tx.nominal;

        // Group by week: Mg 1 (1-7), Mg 2 (8-14), Mg 3 (15-21), Mg 4 (22+)
        let weekIdx = 0;
        if (day >= 1 && day <= 7) weekIdx = 0;
        else if (day >= 8 && day <= 14) weekIdx = 1;
        else if (day >= 15 && day <= 21) weekIdx = 2;
        else weekIdx = 3;

        if (tx.jenis_transaksi) {
          totalPemasukan += amount;
          weeklyData[weekIdx].pemasukan += amount;

          const category = tx.kategori || "Lainnya";
          incomeCategoryTotals[category] = (incomeCategoryTotals[category] || 0) + amount;
        } else {
          totalPengeluaran += amount;
          weeklyData[weekIdx].pengeluaran += amount;

          // Sum category totals only for expenses (pengeluaran)
          const category = tx.kategori || "Lainnya";
          categoryTotals[category] = (categoryTotals[category] || 0) + amount;
        }
      });

      // Format categories into an array of { id, total } sorted descending
      const kategori = Object.entries(categoryTotals)
        .map(([id, total]) => ({ id, total }))
        .sort((a, b) => b.total - a.total);

      const kategoriPemasukan = Object.entries(incomeCategoryTotals)
        .map(([id, total]) => ({ id, total }))
        .sort((a, b) => b.total - a.total);

      // Check if there is older data (before start of this target month)
      const oldestTx = await prisma.transaction.findFirst({
        where: { userId },
        orderBy: { tanggal: "asc" },
      });

      const hasOlderData = oldestTx ? oldestTx.tanggal < start : false;

      return {
        periode,
        totalPengeluaran,
        totalPemasukan,
        grafik: weeklyData,
        kategori,
        kategoriPemasukan,
        hasOlderData,
      };
    } catch (error) {
      console.error("Error fetching monthly report data:", error);
      return null;
    }
  },
  ["monthly-report"],
  { tags: ["reports"] }
);

export async function getMonthlyReport(offset: number) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return null;
  }
  const cookieStore = await cookies();
  const locale = (cookieStore.get("app_locale")?.value as Locale) || "id";
  return getCachedMonthlyReport(session.user.id, offset, locale);
}

const getCachedWeeklyReport = unstable_cache(
  async (userId: string, offset: number, locale: Locale) => {
    const targetDate = addWeeks(new Date(), offset);
    const start = startOfWeek(targetDate, { weekStartsOn: 1 });
    const end = endOfWeek(targetDate, { weekStartsOn: 1 });

    try {
      // Fetch all transactions in the target week for the logged-in user
      const transactions = await prisma.transaction.findMany({
        where: {
          userId,
          tanggal: {
            gte: start,
            lte: end,
          },
        },
      });

      const indonesianMonthsShort = [
        "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
        "Jul", "Agt", "Sep", "Okt", "Nov", "Des"
      ];
      const englishMonthsShort = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];
      const monthsShort = locale === "en" ? englishMonthsShort : indonesianMonthsShort;

      const startStr = `${start.getDate()} ${monthsShort[start.getMonth()]}`;
      const endStr = `${end.getDate()} ${monthsShort[end.getMonth()]} ${end.getFullYear()}`;
      const periode = `${startStr} - ${endStr}`;

      let totalPemasukan = 0;
      let totalPengeluaran = 0;

      const dailyData = [
        { hari: locale === "en" ? "Mon" : "Sen", pengeluaran: 0, pemasukan: 0 },
        { hari: locale === "en" ? "Tue" : "Sel", pengeluaran: 0, pemasukan: 0 },
        { hari: locale === "en" ? "Wed" : "Rab", pengeluaran: 0, pemasukan: 0 },
        { hari: locale === "en" ? "Thu" : "Kam", pengeluaran: 0, pemasukan: 0 },
        { hari: locale === "en" ? "Fri" : "Jum", pengeluaran: 0, pemasukan: 0 },
        { hari: locale === "en" ? "Sat" : "Sab", pengeluaran: 0, pemasukan: 0 },
        { hari: locale === "en" ? "Sun" : "Min", pengeluaran: 0, pemasukan: 0 },
      ];

      const categoryTotals: { [key: string]: number } = {};
      const incomeCategoryTotals: { [key: string]: number } = {};

      transactions.forEach((tx) => {
        const amount = tx.nominal;
        // Monday is index 0, Sunday is index 6
        const dayIdx = (new Date(tx.tanggal).getDay() + 6) % 7;

        if (tx.jenis_transaksi) {
          totalPemasukan += amount;
          dailyData[dayIdx].pemasukan += amount;

          const category = tx.kategori || "Lainnya";
          incomeCategoryTotals[category] = (incomeCategoryTotals[category] || 0) + amount;
        } else {
          totalPengeluaran += amount;
          dailyData[dayIdx].pengeluaran += amount;

          const category = tx.kategori || "Lainnya";
          categoryTotals[category] = (categoryTotals[category] || 0) + amount;
        }
      });

      const kategori = Object.entries(categoryTotals)
        .map(([id, total]) => ({ id, total }))
        .sort((a, b) => b.total - a.total);

      const kategoriPemasukan = Object.entries(incomeCategoryTotals)
        .map(([id, total]) => ({ id, total }))
        .sort((a, b) => b.total - a.total);

      // Check if there is older data (before start of this target week)
      const oldestTx = await prisma.transaction.findFirst({
        where: { userId },
        orderBy: { tanggal: "asc" },
      });

      const hasOlderData = oldestTx ? oldestTx.tanggal < start : false;

      return {
        periode,
        totalPengeluaran,
        totalPemasukan,
        grafik: dailyData,
        kategori,
        kategoriPemasukan,
        hasOlderData,
      };
    } catch (error) {
      console.error("Error fetching weekly report data:", error);
      return null;
    }
  },
  ["weekly-report"],
  { tags: ["reports"] }
);

export async function getWeeklyReport(offset: number) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return null;
  }
  const cookieStore = await cookies();
  const locale = (cookieStore.get("app_locale")?.value as Locale) || "id";
  return getCachedWeeklyReport(session.user.id, offset, locale);
}

const getCachedIncomeReport = unstable_cache(
  async (userId: string, offset: number, locale: Locale) => {
    const targetDate = addMonths(new Date(), offset);
    const start = startOfMonth(targetDate);
    const end = endOfMonth(targetDate);

    try {
      // Fetch all income transactions in the target month for the logged-in user
      const transactions = await prisma.transaction.findMany({
        where: {
          userId,
          jenis_transaksi: true, // true = pemasukan
          tanggal: {
            gte: start,
            lte: end,
          },
        },
      });

      const indonesianMonths = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
      ];
      const englishMonths = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      const months = locale === "en" ? englishMonths : indonesianMonths;
      
      const periode = `${months[targetDate.getMonth()]} ${targetDate.getFullYear()}`;

      let totalPemasukan = 0;
      const assetTotals: { [key: string]: number } = {};

      transactions.forEach((tx) => {
        const amount = tx.nominal;
        totalPemasukan += amount;

        const asset = tx.aset || "Cash";
        assetTotals[asset] = (assetTotals[asset] || 0) + amount;
      });

      // Format assets into an array of { id, total } sorted descending
      const aset = Object.entries(assetTotals)
        .map(([id, total]) => ({ id, total }))
        .sort((a, b) => b.total - a.total);

      // Check if there is older data (before start of this target month)
      const oldestTx = await prisma.transaction.findFirst({
        where: {
          userId,
          jenis_transaksi: true,
        },
        orderBy: { tanggal: "asc" },
      });

      const hasOlderData = oldestTx ? oldestTx.tanggal < start : false;

      return {
        periode,
        totalPemasukan,
        aset,
        hasOlderData,
      };
    } catch (error) {
      console.error("Error fetching income report data:", error);
      return null;
    }
  },
  ["income-report"],
  { tags: ["reports"] }
);

export async function getIncomeReport(offset: number) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return null;
  }
  const cookieStore = await cookies();
  const locale = (cookieStore.get("app_locale")?.value as Locale) || "id";
  return getCachedIncomeReport(session.user.id, offset, locale);
}

const getCachedExpenseReport = unstable_cache(
  async (userId: string, offset: number, locale: Locale) => {
    const targetDate = addMonths(new Date(), offset);
    const start = startOfMonth(targetDate);
    const end = endOfMonth(targetDate);

    try {
      // Fetch all expense transactions in the target month for the logged-in user
      const transactions = await prisma.transaction.findMany({
        where: {
          userId,
          jenis_transaksi: false, // false = pengeluaran
          tanggal: {
            gte: start,
            lte: end,
          },
        },
      });

      const indonesianMonths = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
      ];
      const englishMonths = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      const months = locale === "en" ? englishMonths : indonesianMonths;
      
      const periode = `${months[targetDate.getMonth()]} ${targetDate.getFullYear()}`;

      let totalPengeluaran = 0;
      const categoryTotals: { [key: string]: number } = {};

      transactions.forEach((tx) => {
        const amount = tx.nominal;
        totalPengeluaran += amount;

        const category = tx.kategori || "Lainnya";
        categoryTotals[category] = (categoryTotals[category] || 0) + amount;
      });

      // Format categories into an array of { id, total } sorted descending
      const kategori = Object.entries(categoryTotals)
        .map(([id, total]) => ({ id, total }))
        .sort((a, b) => b.total - a.total);

      // Check if there is older data (before start of this target month)
      const oldestTx = await prisma.transaction.findFirst({
        where: {
          userId,
          jenis_transaksi: false,
        },
        orderBy: { tanggal: "asc" },
      });

      const hasOlderData = oldestTx ? oldestTx.tanggal < start : false;

      return {
        periode,
        totalPengeluaran,
        kategori,
        hasOlderData,
      };
    } catch (error) {
      console.error("Error fetching expense report data:", error);
      return null;
    }
  },
  ["expense-report"],
  { tags: ["reports"] }
);

export async function getExpenseReport(offset: number) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return null;
  }
  const cookieStore = await cookies();
  const locale = (cookieStore.get("app_locale")?.value as Locale) || "id";
  return getCachedExpenseReport(session.user.id, offset, locale);
}

const getCachedMonthlyTransactionsForExport = unstable_cache(
  async (userId: string, offset: number) => {
    const targetDate = addMonths(new Date(), offset);
    const start = startOfMonth(targetDate);
    const end = endOfMonth(targetDate);

    try {
      const transactions = await prisma.transaction.findMany({
        where: {
          userId,
          tanggal: {
            gte: start,
            lte: end,
          },
        },
        orderBy: { tanggal: "asc" },
      });

      return transactions.map(tx => ({
        tanggal: tx.tanggal.toISOString().split('T')[0],
        judul: tx.judul,
        jenis: tx.jenis_transaksi ? "Pemasukan" : "Pengeluaran",
        kategori: tx.kategori,
        aset: tx.aset,
        nominal: tx.nominal,
        keperluan: tx.keperluan,
        mood: tx.mood,
      }));
    } catch (error) {
      console.error("Error fetching transactions for export:", error);
      return null;
    }
  },
  ["export-transactions"],
  { tags: ["reports"] }
);

export async function getMonthlyTransactionsForExport(offset: number) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return null;
  }
  return getCachedMonthlyTransactionsForExport(session.user.id, offset);
}

const getCachedWeeklyTransactionsForExport = unstable_cache(
  async (userId: string, offset: number) => {
    const targetDate = addWeeks(new Date(), offset);
    const start = startOfWeek(targetDate, { weekStartsOn: 1 });
    const end = endOfWeek(targetDate, { weekStartsOn: 1 });

    try {
      const transactions = await prisma.transaction.findMany({
        where: {
          userId,
          tanggal: {
            gte: start,
            lte: end,
          },
        },
        orderBy: { tanggal: "asc" },
      });

      return transactions.map(tx => ({
        tanggal: tx.tanggal.toISOString().split('T')[0],
        judul: tx.judul,
        jenis: tx.jenis_transaksi ? "Pemasukan" : "Pengeluaran",
        kategori: tx.kategori,
        aset: tx.aset,
        nominal: tx.nominal,
        keperluan: tx.keperluan,
        mood: tx.mood,
      }));
    } catch (error) {
      console.error("Error fetching weekly transactions for export:", error);
      return null;
    }
  },
  ["export-weekly-transactions"],
  { tags: ["reports"] }
);

export async function getWeeklyTransactionsForExport(offset: number) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return null;
  }
  return getCachedWeeklyTransactionsForExport(session.user.id, offset);
}




