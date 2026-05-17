"use client";

import { FiArrowLeft, FiChevronLeft, FiChevronRight, FiTrendingDown } from "react-icons/fi";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getExpenseReport } from "@/lib/laporan-data";

const KATEGORI_LIST = [
  { id: "Makanan", icon: "🍔", label: "Makanan" },
  { id: "Transportasi", icon: "🚗", label: "Transport" },
  { id: "Belanja", icon: "🛍️", label: "Belanja" },
  { id: "Tagihan", icon: "🧾", label: "Tagihan" },
  { id: "Lainnya", icon: "📦", label: "Lainnya" },
];

export default function LaporanPengeluaran() {
  const [monthOffset, setMonthOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<{
    periode: string;
    totalPengeluaran: number;
    kategori: { id: string; total: number }[];
    hasOlderData: boolean;
  } | null>(null);

  useEffect(() => {
    setLoading(true);
    getExpenseReport(monthOffset)
      .then((data) => {
        if (data) {
          setReportData(data);
        }
      })
      .catch((err) => {
        console.error("Gagal memuat laporan pengeluaran:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [monthOffset]);

  if (loading && !reportData) {
    return (
      <div className="min-h-screen bg-[#FDF8EE] flex flex-col justify-center items-center font-sans text-black">
        <div className="w-16 h-16 border-8 border-black border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 font-black uppercase text-xs">Memuat Data Laporan...</p>
      </div>
    );
  }

  const currentMonthData = reportData || {
    periode: "Memuat...",
    totalPengeluaran: 0,
    kategori: [],
    hasOlderData: false,
  };

  const totalPengeluaran = currentMonthData.totalPengeluaran;
  const maxKategori = Math.max(...currentMonthData.kategori.map(k => k.total)) || 1;

  // Array warna untuk pie chart
  const PIE_COLORS = ["#FFB443", "#60D689", "#87CEFA", "#DBCBFF", "#FF7676"];

  // Hitung persentase untuk Pie Chart (conic-gradient)
  let cumulativePercent = 0;
  const pieGradientStops = currentMonthData.kategori.length > 0 ? currentMonthData.kategori.map((kat, index) => {
    const persen = totalPengeluaran > 0 ? (kat.total / totalPengeluaran) * 100 : 0;
    const color = PIE_COLORS[index % PIE_COLORS.length];
    const start = cumulativePercent;
    const end = cumulativePercent + persen;
    cumulativePercent = end;
    return `${color} ${start}% ${end}%`;
  }).join(", ") : "#E4E7EB 0% 100%";

  const pieChartBackground = totalPengeluaran > 0 
    ? `conic-gradient(${pieGradientStops})` 
    : `conic-gradient(#E4E7EB 0% 100%)`;

  return (
    <div className="min-h-full bg-[#FDF8EE] flex flex-col relative font-sans text-black pb-10">

      {/* Header Sticky Neo-Brutalist (Warna Merah untuk Pengeluaran) */}
      <div className="bg-[#FF7676] px-5 pt-8 pb-6 flex items-center justify-between border-b-4 border-black shadow-[0_4px_0_0_#000] sticky top-0 z-20">
        <Link href="/profile" className="w-10 h-10 flex items-center justify-center bg-white border-2 border-black rounded-full shadow-[2px_2px_0_0_#000] transition-transform active:scale-95">
          <FiArrowLeft className="w-5 h-5 font-black text-black" />
        </Link>
        <h1 className="text-xl font-black text-black uppercase">Pengeluaran</h1>
        <div className="w-10"></div>
      </div>

      <div className="p-5 flex flex-col gap-6 mt-2">

        {/* Navigasi Bulan */}
        <div className="flex justify-between items-center bg-white border-4 border-black rounded-2xl p-2 shadow-[4px_4px_0_0_#000]">
          <button
            onClick={() => setMonthOffset(monthOffset - 1)}
            disabled={loading || !currentMonthData.hasOlderData}
            className={`w-10 h-10 border-2 border-black rounded-xl flex items-center justify-center transition-all ${loading || !currentMonthData.hasOlderData ? 'bg-gray-100 opacity-50 cursor-not-allowed' : 'bg-gray-100 active:scale-95 hover:bg-gray-200'}`}
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center">
            <span className="font-black text-sm uppercase">{currentMonthData.periode}</span>
            {monthOffset === 0 ? (
              <span className="text-[10px] font-bold text-[#60D689] bg-[#60D689]/20 px-2 py-0.5 rounded-full mt-0.5 border border-[#60D689]">Bulan Ini</span>
            ) : (
              <span className="text-[10px] font-bold text-gray-500 mt-0.5">{Math.abs(monthOffset)} bulan lalu</span>
            )}
          </div>

          <button
            onClick={() => setMonthOffset(monthOffset + 1)}
            disabled={loading || monthOffset === 0}
            className={`w-10 h-10 border-2 border-black rounded-xl flex items-center justify-center transition-all ${loading || monthOffset === 0 ? 'bg-gray-100 opacity-50 cursor-not-allowed' : 'bg-gray-100 active:scale-95 hover:bg-gray-200'}`}
          >
            <FiChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Ringkasan Total Pengeluaran */}
        <div className="bg-white border-4 border-black rounded-3xl p-6 shadow-[8px_8px_0_0_#000] flex flex-col items-center justify-center text-center mt-2">
           <span className="text-[10px] font-bold uppercase bg-[#FF7676] px-3 py-1.5 border-2 border-black rounded-xl shadow-[2px_2px_0_0_#000] mb-3 flex items-center gap-1.5">
             <FiTrendingDown className="w-3 h-3" /> Total Pengeluaran
           </span>
           <div className="flex items-start">
             <span className="text-xl font-black mt-1 mr-1">Rp</span>
             <p className="text-4xl font-black text-black drop-shadow-[2px_2px_0_rgba(0,0,0,0.1)] tracking-tight">
               {totalPengeluaran.toLocaleString('id-ID')}
             </p>
           </div>
        </div>

        {/* Pie Chart / Donut Chart Neo-Brutalist */}
        <div className="bg-white border-4 border-black rounded-3xl p-6 shadow-[4px_4px_0_0_#000] flex flex-col items-center justify-center mt-2">
           <h2 className="text-sm font-black uppercase w-full text-center mb-6">Proporsi Kategori</h2>
           <div 
             className="w-48 h-48 rounded-full border-4 border-black shadow-[4px_4px_0_0_#000] relative transition-transform active:scale-95 duration-300"
             style={{ background: pieChartBackground }}
           >
             {/* Center hole for Donut Chart effect */}
             <div className="absolute inset-0 m-auto w-24 h-24 bg-white rounded-full border-4 border-black flex flex-col items-center justify-center shadow-inner">
               <span className="text-2xl">🍔</span>
               <span className="text-[10px] font-black uppercase mt-1 text-center leading-tight">Total<br/>Kategori</span>
             </div>
           </div>
        </div>

        {/* Rincian Berdasarkan Kategori (Horizontal Bar Chart) */}
        <div className="bg-white border-4 border-black rounded-3xl p-5 shadow-[4px_4px_0_0_#000] mt-2">
           <h2 className="text-sm font-black uppercase flex items-center justify-between border-b-2 border-black pb-3 mb-5">
             Rincian Kategori
             <span className="text-xl">🧾</span>
           </h2>

           <div className="flex flex-col gap-6">
              {currentMonthData.kategori.length === 0 ? (
                <div className="text-center py-6 text-gray-500 font-bold text-xs uppercase">
                  Belum ada pengeluaran di bulan ini
                </div>
              ) : (
                currentMonthData.kategori.map((kat, index) => {
                   const info = KATEGORI_LIST.find(k => k.id === kat.id) || { id: kat.id, icon: "📦", label: kat.id };
                   
                   // PersenMax digunakan untuk panjang Bar
                   const persenMax = maxKategori > 0 ? (kat.total / maxKategori) * 100 : 0;
                   
                   // PersenTotal digunakan untuk text informasi kontribusi (%)
                   const persenTotal = totalPengeluaran > 0 ? (kat.total / totalPengeluaran) * 100 : 0;

                   const barColor = PIE_COLORS[index % PIE_COLORS.length];

                   return (
                     <div key={kat.id} className="flex flex-col gap-1.5 transition-transform active:scale-[0.98] cursor-pointer">
                        <div className="flex justify-between items-center text-xs font-bold text-black">
                           <div className="flex items-center gap-2">
                              <span 
                                className="border-2 border-black rounded-lg p-1 w-8 h-8 flex items-center justify-center text-sm shadow-[2px_2px_0_0_#000]"
                                style={{ backgroundColor: barColor }}
                              >
                                {info.icon}
                              </span>
                              <span className="uppercase">{info.label}</span>
                           </div>
                           <div className="flex flex-col items-end">
                              <span>Rp {kat.total.toLocaleString('id-ID')}</span>
                              <span className="text-[9px] text-gray-500 mt-0.5">{persenTotal.toFixed(1)}% dari total</span>
                           </div>
                        </div>
                        
                        {/* Bar Horizontal Neo Brutalist yang Rapih */}
                        <div className="h-2 w-full bg-[#FDF8EE] border-2 border-black rounded-full overflow-hidden mt-1 shadow-inner">
                           <div 
                             className="h-full border-r-2 border-black transition-all duration-500 ease-out" 
                             style={{ width: `${Math.min(persenMax, 100)}%`, backgroundColor: barColor }}
                           ></div>
                        </div>
                     </div>
                   )
                })
              )}
           </div>
        </div>

      </div>
    </div>
  );
}
