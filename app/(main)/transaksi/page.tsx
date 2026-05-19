import { Suspense } from "react";
import { FiPlus } from "react-icons/fi";
import Link from "next/link";
import TransactionFilter, { TransactionTypeTabs, TransactionTimeFilter } from "@/components/transaction-filter";
import Search from "@/components/search";
import { getTransactionsData } from "@/lib/data";
import TransactionListClient from "@/components/transaction-list-client";
import { cookies } from "next/headers";
import { translations, Locale } from "@/lib/translations";

interface TransaksiPageProps {
  searchParams?: Promise<{
    query?: string;
    jenis?: string;
    bulan?: string;
    tahun?: string;
    kategori?: string;
    keperluan?: string;
    mood?: string;
    sort?: string;
  }>;
}

export default async function TransaksiPage({ searchParams }: TransaksiPageProps) {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("app_locale")?.value || "id") as Locale;
  const t = translations[locale];

  return (
    <div className="min-h-full bg-[#FDF8EE] relative font-sans text-black">

      {/* Header Biru Atas (Ikut Scroll) */}
      <div className="bg-[#86B6F6] px-5 pt-8 pb-4 relative z-10">
        <div className="flex justify-between items-center">
          <div className="flex flex-col text-white drop-shadow-md">
            <h1 className="text-3xl font-black mb-1">{t.semua_transaksi}</h1>
            <p className="text-xs font-bold opacity-90 tracking-wide">{t.kelola_transaksi_di_sini}</p>
          </div>
          <div className="text-5xl drop-shadow-lg translate-y-2">
            🐻❄️
          </div>
        </div>
      </div>

      {/* Header Biru Bawah (Sticky Search Bar) */}
      <div className="sticky top-0 z-[90] bg-[#86B6F6] px-5 pb-8 pt-2 rounded-b-[40px] border-b-4 border-black shadow-[0_8px_0_0_#000] -mt-[1px]">
        {/* Search Bar */}
        <Suspense fallback={<div className="bg-white/20 border-2 border-transparent rounded-2xl flex items-center px-4 py-3 h-[48px] animate-pulse w-full"></div>}>
          <Search placeholder={t.cari_transaksi} />
        </Suspense>
      </div>

      <div className="container mx-auto px-4 mt-8 flex flex-col gap-6">

        {/* Filter Card */}
        <div className="bg-white border-2 border-black rounded-3xl p-5 shadow-[4px_4px_0_0_#000] flex flex-col gap-5">

          {/* Tabs */}
          <Suspense fallback={<div className="h-10 bg-[#FDF8EE] rounded-2xl border-2 border-black shadow-inner animate-pulse"></div>}>
            <TransactionTypeTabs />
          </Suspense>

          {/* Filter Waktu */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-black uppercase tracking-wider ml-1">{t.filter_waktu}</label>
            <Suspense fallback={<div className="h-[42px] bg-white border-2 border-black rounded-xl animate-pulse"></div>}>
              <TransactionTimeFilter />
            </Suspense>
          </div>

          {/* Filter Kategori / Lanjutan */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-black uppercase tracking-wider ml-1">{t.filter_kategori_lanjutan}</label>
            <Suspense fallback={<div className="bg-black text-[#E4F087] border-2 border-black rounded-xl px-5 py-3 w-32 h-[42px] animate-pulse"></div>}>
              <TransactionFilter
                triggerClassName="bg-black text-[#E4F087] border-2 border-black rounded-xl px-5 py-3 text-xs font-black shadow-[2px_2px_0_0_#000] flex items-center justify-center gap-2 active:scale-95 transition-transform w-fit relative"
                triggerContent={<><span className="text-base leading-none">💰</span> {t.filter_lengkap}</>}
              />
            </Suspense>
          </div>
        </div>

        {/* Transaction List Wrapper Client (Data dinamis dari database terfilter) */}
        <Suspense fallback={<TransactionListSkeleton />}>
          <TransactionListSection searchParams={searchParams} />
        </Suspense>

      </div>
    </div>
  );
}

async function TransactionListSection({ searchParams }: TransaksiPageProps) {
  const params = await searchParams;

  // Tangkap query params sesuai dengan parameter pencarian dan filter di UI kita
  const query = params?.query || "";
  const jenis = params?.jenis || "Semua";
  const bulan = params?.bulan || "";
  const tahun = params?.tahun || "";
  const kategori = params?.kategori || "";
  const keperluan = params?.keperluan || "";
  const mood = params?.mood || "";
  const sort = params?.sort || "terbaru";

  // Hubungkan ke database dengan query params yang dinamis
  const transactions = await getTransactionsData({
    search: query,
    jenis,
    bulan,
    tahun,
    kategori,
    keperluan,
    mood,
    sort,
  });

  return <TransactionListClient data={transactions} />;
}

function TransactionListSkeleton() {
  return (
    <div className="flex flex-col gap-6 mt-2 pb-4 animate-pulse">
      {[1, 2].map((i) => (
        <div key={i} className="flex flex-col gap-3">
          {/* Header Tanggal Skeleton */}
          <div className="flex justify-between items-end px-1 mb-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black/20 rounded-xl border-2 border-black/10 shadow-[2px_2px_0_0_rgba(0,0,0,0.05)]"></div>
              <div className="flex flex-col gap-1.5">
                <div className="w-14 h-3.5 bg-black/20 rounded"></div>
                <div className="w-20 h-3 bg-black/10 rounded"></div>
              </div>
            </div>
            <div className="w-24 h-6 bg-black/15 rounded-xl border-2 border-black/10 shadow-[2px_2px_0_0_rgba(0,0,0,0.05)]"></div>
          </div>

          {/* List Transaksi Skeleton */}
          <div className="bg-white rounded-3xl p-3 border-2 border-black shadow-[6px_6px_0_0_#000] flex flex-col gap-1 overflow-hidden">
            {[1, 2].map((j) => (
              <div
                key={j}
                className={`flex justify-between items-center py-3 px-1 ${j === 1 ? 'border-b-2 border-black/10' : ''}`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 bg-black/15 border-2 border-black rounded-xl shadow-[2px_2px_0_0_#000]"></div>
                  <div className="flex flex-col gap-2">
                    <div className="w-24 h-4 bg-black/20 rounded"></div>
                    <div className="flex gap-1.5">
                      <div className="w-12 h-3.5 bg-black/10 rounded"></div>
                      <div className="w-14 h-3.5 bg-black/10 rounded"></div>
                    </div>
                  </div>
                </div>
                <div className="w-16 h-4 bg-black/20 rounded mr-2"></div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
