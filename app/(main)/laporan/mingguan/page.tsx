"use client";

import { FiArrowLeft, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getWeeklyReport } from "@/lib/laporan-data";
import { useLanguage } from "@/components/language-provider";

const KATEGORI_LIST = [
  { id: "Makanan", icon: "🍔", label: "Makanan" },
  { id: "Transportasi", icon: "🚗", label: "Transport" },
  { id: "Belanja", icon: "🛍️", label: "Belanja" },
  { id: "Tagihan", icon: "🧾", label: "Tagihan" },
  { id: "Pemasukan", icon: "💰", label: "Pemasukan" },
  { id: "Lainnya", icon: "📦", label: "Lainnya" },
];

export default function LaporanMingguan() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
  const [reportData, setReportData] = useState<{
    periode: string;
    totalPengeluaran: number;
    totalPemasukan: number;
    grafik: { hari: string; pengeluaran: number; pemasukan: number }[];
    kategori: { id: string; total: number }[];
    hasOlderData: boolean;
  } | null>(null);

  const translateKategori = (val: string) => {
    if (val === "Makanan") return t("opt_makanan");
    if (val === "Transportasi") return t("opt_transportasi");
    if (val === "Belanja") return t("opt_belanja");
    if (val === "Tagihan") return t("opt_tagihan");
    if (val === "Pemasukan") return t("opt_pemasukan");
    return t("opt_lainnya");
  };

  const translateDay = (day: string) => {
    if (day === "Sen") return t("day_sen");
    if (day === "Sel") return t("day_sel");
    if (day === "Rab") return t("day_rab");
    if (day === "Kam") return t("day_kam");
    if (day === "Jum") return t("day_jum");
    if (day === "Sab") return t("day_sab");
    if (day === "Min") return t("day_min");
    return day;
  };

  useEffect(() => {
    setLoading(true);
    getWeeklyReport(weekOffset)
      .then((data) => {
        if (data) {
          setReportData(data);
        }
      })
      .catch((err) => {
        console.error("Gagal memuat laporan mingguan:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [weekOffset]);

  if (loading && !reportData) {
    return (
      <div className="min-h-screen bg-[#FDF8EE] flex flex-col justify-center items-center font-sans text-black">
        <div className="w-16 h-16 border-8 border-black border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 font-black uppercase text-xs">{t("memuat_laporan")}</p>
      </div>
    );
  }

  const currentWeekData = reportData || {
    periode: t("menyimpan") === "Saving..." ? "Loading..." : "Memuat...",
    totalPengeluaran: 0,
    totalPemasukan: 0,
    grafik: [
      { hari: "Sen", pengeluaran: 0, pemasukan: 0 },
      { hari: "Sel", pengeluaran: 0, pemasukan: 0 },
      { hari: "Rab", pengeluaran: 0, pemasukan: 0 },
      { hari: "Kam", pengeluaran: 0, pemasukan: 0 },
      { hari: "Jum", pengeluaran: 0, pemasukan: 0 },
      { hari: "Sab", pengeluaran: 0, pemasukan: 0 },
      { hari: "Min", pengeluaran: 0, pemasukan: 0 },
    ],
    kategori: [],
    hasOlderData: false,
  };

  const totalPengeluaran = currentWeekData.totalPengeluaran;
  const totalPemasukan = currentWeekData.totalPemasukan;
  const maxPengeluaran = Math.max(...currentWeekData.grafik.map(d => d.pengeluaran)) || 1;

  return (
    <div className="min-h-full bg-[#FDF8EE] flex flex-col relative font-sans text-black pb-10">

      {/* Header Sticky Neo-Brutalist */}
      <div className="bg-[#DBCBFF] px-5 pt-8 pb-6 flex items-center justify-between border-b-4 border-black shadow-[0_4px_0_0_#000] sticky top-0 z-20">
        <Link href="/profile" className="w-10 h-10 flex items-center justify-center bg-white border-2 border-black rounded-full shadow-[2px_2px_0_0_#000] transition-transform active:scale-95">
          <FiArrowLeft className="w-5 h-5 font-black text-black" />
        </Link>
        <h1 className="text-xl font-black text-black uppercase">{t("mingguan")}</h1>
        <div className="w-10"></div>
      </div>

      <div className="p-5 flex flex-col gap-6 mt-2">

        {/* Navigasi Minggu */}
        <div className="flex justify-between items-center bg-white border-4 border-black rounded-2xl p-2 shadow-[4px_4px_0_0_#000]">
          <button
            onClick={() => setWeekOffset(weekOffset - 1)}
            disabled={loading || !currentWeekData.hasOlderData}
            className={`w-10 h-10 border-2 border-black rounded-xl flex items-center justify-center transition-all ${loading || !currentWeekData.hasOlderData ? 'bg-gray-100 opacity-50 cursor-not-allowed' : 'bg-gray-100 active:scale-95 hover:bg-gray-200'}`}
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center">
            <span className="font-black text-sm uppercase">{currentWeekData.periode}</span>
            {weekOffset === 0 ? (
              <span className="text-[10px] font-bold text-[#FF7676] bg-[#FF7676]/20 px-2 py-0.5 rounded-full mt-0.5 border border-[#FF7676]">{t("minggu_ini")}</span>
            ) : (
              <span className="text-[10px] font-bold text-gray-500 mt-0.5">{Math.abs(weekOffset)} {t("minggu_lalu")}</span>
            )}
          </div>

          <button
            onClick={() => setWeekOffset(weekOffset + 1)}
            disabled={loading || weekOffset === 0}
            className={`w-10 h-10 border-2 border-black rounded-xl flex items-center justify-center transition-all ${loading || weekOffset === 0 ? 'bg-gray-100 opacity-50 cursor-not-allowed' : 'bg-gray-100 active:scale-95 hover:bg-gray-200'}`}
          >
            <FiChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Ringkasan */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#FF7676] border-4 border-black rounded-3xl p-4 shadow-[4px_4px_0_0_#000] flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase bg-white/50 px-2 py-1 border border-black rounded shadow-[2px_2px_0_0_#000] w-fit mb-4">{t("total_pengeluaran").split(" ").pop()}</span>
            <p className="text-lg font-black leading-tight">Rp {totalPengeluaran.toLocaleString('id-ID')}</p>
          </div>
          <div className="bg-[#60D689] border-4 border-black rounded-3xl p-4 shadow-[4px_4px_0_0_#000] flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase bg-white/50 px-2 py-1 border border-black rounded shadow-[2px_2px_0_0_#000] w-fit mb-4">{t("total_pemasukan").split(" ").pop()}</span>
            <p className="text-lg font-black leading-tight">Rp {totalPemasukan.toLocaleString('id-ID')}</p>
          </div>
        </div>

        {/* Bar Chart CSS */}
        <div className="bg-white border-4 border-black rounded-3xl p-5 shadow-[4px_4px_0_0_#000]">
          <h2 className="text-sm font-black uppercase mb-6 flex items-center justify-between">
            {t("grafik_pengeluaran")}
            <span className="text-xl">📉</span>
          </h2>

          <div className="flex justify-between items-end h-56 border-b-4 border-black pb-2 gap-2 relative">
            <div className="absolute top-0 left-0 right-0 border-t-2 border-dashed border-gray-300 pointer-events-none"></div>
            <div className="absolute top-1/2 left-0 right-0 border-t-2 border-dashed border-gray-300 pointer-events-none"></div>

            {currentWeekData.grafik.map(d => (
              <div key={d.hari} className="flex flex-col items-center gap-2 w-full h-full justify-end group cursor-pointer">
                <div
                  className="w-full bg-[#FF7676] border-2 border-black rounded-t-lg relative transition-all group-hover:bg-[#FF5555] group-active:scale-95 origin-bottom z-10 shadow-[2px_0_0_0_#000]"
                  style={{ height: `${(d.pengeluaran / maxPengeluaran) * 100}%`, minHeight: '15%' }}
                >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-[#E4F087] text-[10px] font-bold px-2 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 shadow-[2px_2px_0_0_#E4F087]">
                    {d.pengeluaran.toLocaleString('id-ID')}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-black"></div>
                  </div>
                </div>
                <span className={`text-[10px] font-black uppercase ${d.hari === "Min" || d.hari === "Sab" ? "text-[#FF7676]" : "text-black"}`}>
                  {translateDay(d.hari)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between text-[10px] font-bold text-black/70 bg-gray-50 border-2 border-black rounded-xl px-3 py-2">
            <span>{t("rata_rata_pengeluaran")}</span>
            <span className="text-black text-xs">Rp {Math.round(totalPengeluaran / 7).toLocaleString('id-ID')} / {t("hari")}</span>
          </div>
        </div>

        {/* Rincian Kategori */}
        <div className="bg-white border-4 border-black rounded-3xl p-5 shadow-[4px_4px_0_0_#000]">
          <h2 className="text-sm font-black uppercase flex items-center justify-between border-b-2 border-black pb-3 mb-4">
            {t("rincian_kategori")}
            <span className="text-xl">🍔</span>
          </h2>

          <div className="flex flex-col gap-4">
            {currentWeekData.kategori.length === 0 ? (
              <div className="text-center py-6 text-gray-500 font-bold text-xs uppercase">
                {t("belum_ada_pengeluaran_minggu_ini")}
              </div>
            ) : (
              currentWeekData.kategori.map((kat) => {
                const info = KATEGORI_LIST.find(k => k.id === kat.id);
                if (!info) return null;
                const persen = totalPengeluaran > 0 ? (kat.total / totalPengeluaran) * 100 : 0;

                return (
                  <div key={kat.id} className="flex flex-col gap-1.5 transition-transform active:scale-[0.98] cursor-pointer">
                    <div className="flex justify-between items-center text-xs font-bold text-black">
                      <div className="flex items-center gap-2">
                        <span className="bg-[#FDF8EE] border-2 border-black rounded-lg p-1 w-8 h-8 flex items-center justify-center text-sm shadow-[2px_2px_0_0_#000]">
                          {info.icon}
                        </span>
                        <span className="uppercase">{translateKategori(info.id)}</span>
                      </div>
                      <span>Rp {kat.total.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="h-2 w-full bg-[#FDF8EE] border-2 border-black rounded-full overflow-hidden mt-1 shadow-inner">
                      <div className="h-full bg-[#FFB443] border-r-2 border-black" style={{ width: `${Math.min(persen, 100)}%` }}></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
