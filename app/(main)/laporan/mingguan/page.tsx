"use client";

import { FiArrowLeft, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getWeeklyReport, getWeeklyTransactionsForExport } from "@/lib/laporan-data";
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
  const [exporting, setExporting] = useState(false);
  const [activeTab, setActiveTab] = useState<"pengeluaran" | "pemasukan">("pengeluaran");
  const { t } = useLanguage();
  const [reportData, setReportData] = useState<{
    periode: string;
    totalPengeluaran: number;
    totalPemasukan: number;
    grafik: { hari: string; pengeluaran: number; pemasukan: number }[];
    kategori: { id: string; total: number }[];
    kategoriPemasukan?: { id: string; total: number }[];
    hasOlderData: boolean;
  } | null>(null);

  const translateKategori = (val: string): string => {
    if (val === "Makanan") return t("opt_makanan");
    if (val === "Transportasi") return t("opt_transportasi");
    if (val === "Belanja") return t("opt_belanja");
    if (val === "Tagihan") return t("opt_tagihan");
    if (val === "Pemasukan") return t("opt_pemasukan");
    return t("opt_lainnya");
  };

  const translateDay = (day: string): string => {
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
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getWeeklyReport(weekOffset);
        if (isMounted && data) {
          setReportData(data);
        }
      } catch (err) {
        if (isMounted) console.error("Gagal memuat laporan mingguan:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [weekOffset]);

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const data = await getWeeklyTransactionsForExport(weekOffset);
      if (!data || data.length === 0) {
        alert(t("tidak_ada_transaksi_export"));
        return;
      }

      // Construct CSV string with UTF-8 BOM to support Indonesian/English Excel compatibility
      const headers = [
        t("tanggal"), 
        t("keterangan"), 
        t("opt_semua") === "All" ? "Type" : "Jenis", 
        t("kategori"), 
        t("aset"), 
        t("opt_semua") === "All" ? "Amount" : "Nominal", 
        t("keperluan"), 
        t("mood")
      ];
      const csvRows = [headers.join(",")];

      for (const row of data) {
        const values = [
          row.tanggal,
          `"${row.judul.replace(/"/g, '""')}"`,
          row.jenis === "Pemasukan" ? t("opt_pemasukan") : t("opt_pengeluaran"),
          translateKategori(row.kategori),
          row.aset === "Cash" && t("opt_semua") === "All" ? "Cash" : (row.aset === "Cash" ? "Tunai" : row.aset),
          row.nominal,
          row.keperluan === "Kebutuhan" ? t("opt_kebutuhan") : 
          row.keperluan === "Impulsif" ? t("opt_impulsif") : 
          row.keperluan === "Emergency" ? t("opt_emergency") : t("opt_goals"),
          row.mood === "Senang" ? t("opt_senang") :
          row.mood === "Marah" ? t("opt_marah") :
          row.mood === "Sedih" ? t("opt_sedih") : t("opt_biasa")
        ];
        csvRows.push(values.join(","));
      }

      const csvContent = "\uFEFF" + csvRows.join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `Laporan_Keuangan_Mingguan_${currentWeekData.periode.replace(/\s+/g, '_')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Gagal mengekspor CSV:", err);
      alert(t("error_export"));
    } finally {
      setExporting(false);
    }
  };

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
    kategoriPemasukan: [],
    hasOlderData: false,
  };

  const totalPengeluaran = currentWeekData.totalPengeluaran;
  const totalPemasukan = currentWeekData.totalPemasukan;
  
  const isPengeluaran = activeTab === "pengeluaran";
  const activeTotal = isPengeluaran ? totalPengeluaran : totalPemasukan;
  
  const maxVal = Math.max(...currentWeekData.grafik.map(d => isPengeluaran ? d.pengeluaran : d.pemasukan)) || 1;
  const isEn = t("opt_semua") === "All";
  
  const chartTitle = isPengeluaran
    ? t("grafik_pengeluaran")
    : (isEn ? "Income Chart" : "Grafik Pemasukan");

  const averageTitle = isPengeluaran
    ? t("rata_rata_pengeluaran")
    : (isEn ? "Average Income" : "Rata-rata Pemasukan");

  const activeKategori = isPengeluaran 
    ? currentWeekData.kategori 
    : (currentWeekData.kategoriPemasukan || []);

  const noCategoryMsg = isPengeluaran 
    ? t("belum_ada_pengeluaran_minggu_ini") 
    : (isEn ? "No income recorded this week" : "Belum ada pemasukan di minggu ini");

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

        {/* Tombol Export Laporan Mingguan */}
        <button
          onClick={handleExportCSV}
          disabled={exporting || loading}
          className="w-full bg-[#87CEFA] border-4 border-black rounded-2xl p-4 font-black uppercase text-xs shadow-[4px_4px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-[0px_0px_0_0_#000] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
        >
          {exporting ? (
            <>
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              {t("mengekspor_laporan")}
            </>
          ) : (
            <>
              📥 {t("export_laporan_csv")}
            </>
          )}
        </button>

        {/* Ringkasan */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setActiveTab("pengeluaran")}
            className={`border-4 border-black rounded-3xl p-4 flex flex-col justify-between text-left transition-all active:scale-95 ${
              isPengeluaran
                ? "bg-[#FF7676] shadow-[4px_4px_0_0_#000]"
                : "bg-[#FF7676]/30 opacity-60 shadow-[1px_1px_0_0_#000] translate-x-[3px] translate-y-[3px]"
            }`}
          >
            <span className="text-[10px] font-bold uppercase bg-white/50 px-2 py-1 border border-black rounded shadow-[2px_2px_0_0_#000] w-fit mb-4">{t("total_pengeluaran").split(" ").pop()}</span>
            <p className="text-lg font-black leading-tight">Rp {totalPengeluaran.toLocaleString('id-ID')}</p>
          </button>
          
          <button
            onClick={() => setActiveTab("pemasukan")}
            className={`border-4 border-black rounded-3xl p-4 flex flex-col justify-between text-left transition-all active:scale-95 ${
              !isPengeluaran
                ? "bg-[#60D689] shadow-[4px_4px_0_0_#000]"
                : "bg-[#60D689]/30 opacity-60 shadow-[1px_1px_0_0_#000] translate-x-[3px] translate-y-[3px]"
            }`}
          >
            <span className="text-[10px] font-bold uppercase bg-white/50 px-2 py-1 border border-black rounded shadow-[2px_2px_0_0_#000] w-fit mb-4">{t("total_pemasukan").split(" ").pop()}</span>
            <p className="text-lg font-black leading-tight">Rp {totalPemasukan.toLocaleString('id-ID')}</p>
          </button>
        </div>

        {/* Bar Chart CSS */}
        <div className="bg-white border-4 border-black rounded-3xl p-5 shadow-[4px_4px_0_0_#000]">
          <h2 className="text-sm font-black uppercase mb-6 flex items-center justify-between">
            {chartTitle}
            <span className="text-xl">{isPengeluaran ? "📉" : "📈"}</span>
          </h2>

          <div className="flex justify-between items-end h-56 border-b-4 border-black pb-2 gap-2 relative">
            <div className="absolute top-0 left-0 right-0 border-t-2 border-dashed border-gray-300 pointer-events-none"></div>
            <div className="absolute top-1/2 left-0 right-0 border-t-2 border-dashed border-gray-300 pointer-events-none"></div>

            {currentWeekData.grafik.map(d => {
              const val = isPengeluaran ? d.pengeluaran : d.pemasukan;
              return (
                <div key={d.hari} className="flex flex-col items-center gap-2 w-full h-full justify-end group cursor-pointer">
                  <div
                    className={`w-full border-2 border-black rounded-t-lg relative transition-all group-active:scale-95 origin-bottom z-10 shadow-[2px_0_0_0_#000] ${
                      isPengeluaran 
                        ? 'bg-[#FF7676] hover:bg-[#FF5555]' 
                        : 'bg-[#60D689] hover:bg-[#4ECA79]'
                    }`}
                    style={{ height: `${(val / maxVal) * 100}%`, minHeight: '15%' }}
                  >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-[#E4F087] text-[10px] font-bold px-2 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 shadow-[2px_2px_0_0_#E4F087]">
                      {val.toLocaleString('id-ID')}
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-black"></div>
                    </div>
                  </div>
                  <span className={`text-[10px] font-black uppercase ${d.hari === "Min" || d.hari === "Sab" ? (isPengeluaran ? "text-[#FF7676]" : "text-[#60D689]") : "text-black"}`}>
                    {translateDay(d.hari)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-5 flex items-center justify-between text-[10px] font-bold text-black/70 bg-gray-50 border-2 border-black rounded-xl px-3 py-2">
            <span>{averageTitle}</span>
            <span className="text-black text-xs">Rp {Math.round(activeTotal / 7).toLocaleString('id-ID')} / {t("hari")}</span>
          </div>
        </div>

        {/* Rincian Kategori */}
        <div className="bg-white border-4 border-black rounded-3xl p-5 shadow-[4px_4px_0_0_#000]">
          <h2 className="text-sm font-black uppercase flex items-center justify-between border-b-2 border-black pb-3 mb-4">
            {isPengeluaran ? t("rincian_kategori") : (isEn ? "Income Breakdown" : "Rincian Pemasukan")}
            <span className="text-xl">{isPengeluaran ? "🍔" : "💰"}</span>
          </h2>

          <div className="flex flex-col gap-4">
            {activeKategori.length === 0 ? (
              <div className="text-center py-6 text-gray-500 font-bold text-xs uppercase">
                {noCategoryMsg}
              </div>
            ) : (
              activeKategori.map((kat) => {
                const info = KATEGORI_LIST.find(k => k.id === kat.id);
                if (!info) return null;
                const persen = activeTotal > 0 ? (kat.total / activeTotal) * 100 : 0;

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
