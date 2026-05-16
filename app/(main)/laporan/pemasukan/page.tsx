"use client";

import { FiArrowLeft, FiChevronLeft, FiChevronRight, FiTrendingUp } from "react-icons/fi";
import Link from "next/link";
import { useState } from "react";

const ASET_LIST = [
  { id: "Cash", icon: "💵", label: "Cash" },
  { id: "BNI", icon: "🏦", label: "BNI" },
  { id: "BCA", icon: "🏦", label: "BCA" },
  { id: "OVO", icon: "📱", label: "OVO" },
  { id: "Gopay", icon: "📱", label: "Gopay" },
];

const data = [
  {
    periode: "Mei 2026",
    totalPemasukan: 8500000,
    aset: [
      { id: "BCA", total: 5000000 },
      { id: "BNI", total: 2000000 },
      { id: "Cash", total: 500000 },
      { id: "OVO", total: 500000 },
      { id: "Gopay", total: 500000 },
    ]
  },
  {
    periode: "April 2026",
    totalPemasukan: 7000000,
    aset: [
      { id: "BCA", total: 4000000 },
      { id: "BNI", total: 1000000 },
      { id: "Cash", total: 1000000 },
      { id: "OVO", total: 500000 },
      { id: "Gopay", total: 500000 },
    ]
  }
];

export default function LaporanPemasukan() {
  const [monthOffset, setMonthOffset] = useState(0);

  const currentMonthData = data[Math.abs(monthOffset)] || data[0];
  const totalPemasukan = currentMonthData.totalPemasukan;
  
  // Mencari nilai tertinggi untuk skala bar chart proporsional
  const maxAset = Math.max(...currentMonthData.aset.map(a => a.total));

  // Array warna untuk pie chart
  const PIE_COLORS = ["#FF7676", "#FFB443", "#60D689", "#87CEFA", "#DBCBFF"];

  // Hitung persentase untuk Pie Chart (conic-gradient)
  let cumulativePercent = 0;
  const pieGradientStops = currentMonthData.aset.map((ast, index) => {
    const persen = totalPemasukan > 0 ? (ast.total / totalPemasukan) * 100 : 0;
    const color = PIE_COLORS[index % PIE_COLORS.length];
    const start = cumulativePercent;
    const end = cumulativePercent + persen;
    cumulativePercent = end;
    return `${color} ${start}% ${end}%`;
  }).join(", ");

  const pieChartBackground = `conic-gradient(${pieGradientStops})`;

  return (
    <div className="min-h-full bg-[#FDF8EE] flex flex-col relative font-sans text-black pb-10">

      {/* Header Sticky Neo-Brutalist (Warna Hijau untuk Pemasukan) */}
      <div className="bg-[#60D689] px-5 pt-8 pb-6 flex items-center justify-between border-b-4 border-black shadow-[0_4px_0_0_#000] sticky top-0 z-20">
        <Link href="/profile" className="w-10 h-10 flex items-center justify-center bg-white border-2 border-black rounded-full shadow-[2px_2px_0_0_#000] transition-transform active:scale-95">
          <FiArrowLeft className="w-5 h-5 font-black text-black" />
        </Link>
        <h1 className="text-xl font-black text-black uppercase">Pemasukan</h1>
        <div className="w-10"></div>
      </div>

      <div className="p-5 flex flex-col gap-6 mt-2">

        {/* Navigasi Bulan */}
        <div className="flex justify-between items-center bg-white border-4 border-black rounded-2xl p-2 shadow-[4px_4px_0_0_#000]">
          <button
            onClick={() => setMonthOffset(monthOffset - 1)}
            disabled={Math.abs(monthOffset - 1) >= data.length}
            className={`w-10 h-10 border-2 border-black rounded-xl flex items-center justify-center transition-all ${Math.abs(monthOffset - 1) >= data.length ? 'bg-gray-100 opacity-50 cursor-not-allowed' : 'bg-gray-100 active:scale-95 hover:bg-gray-200'}`}
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center">
            <span className="font-black text-sm uppercase">{currentMonthData.periode}</span>
            {monthOffset === 0 ? (
              <span className="text-[10px] font-bold text-[#FF7676] bg-[#FF7676]/20 px-2 py-0.5 rounded-full mt-0.5 border border-[#FF7676]">Bulan Ini</span>
            ) : (
              <span className="text-[10px] font-bold text-gray-500 mt-0.5">{Math.abs(monthOffset)} bulan lalu</span>
            )}
          </div>

          <button
            onClick={() => setMonthOffset(monthOffset + 1)}
            disabled={monthOffset === 0}
            className={`w-10 h-10 border-2 border-black rounded-xl flex items-center justify-center transition-all ${monthOffset === 0 ? 'bg-gray-100 opacity-50 cursor-not-allowed' : 'bg-gray-100 active:scale-95 hover:bg-gray-200'}`}
          >
            <FiChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Ringkasan Total Pemasukan */}
        <div className="bg-white border-4 border-black rounded-3xl p-6 shadow-[8px_8px_0_0_#000] flex flex-col items-center justify-center text-center mt-2">
           <span className="text-[10px] font-bold uppercase bg-[#60D689] px-3 py-1.5 border-2 border-black rounded-xl shadow-[2px_2px_0_0_#000] mb-3 flex items-center gap-1.5">
             <FiTrendingUp className="w-3 h-3" /> Total Pemasukan
           </span>
           <div className="flex items-start">
             <span className="text-xl font-black mt-1 mr-1">Rp</span>
             <p className="text-4xl font-black text-black drop-shadow-[2px_2px_0_rgba(0,0,0,0.1)] tracking-tight">
               {totalPemasukan.toLocaleString('id-ID')}
             </p>
           </div>
        </div>

        {/* Pie Chart / Donut Chart Neo-Brutalist */}
        <div className="bg-white border-4 border-black rounded-3xl p-6 shadow-[4px_4px_0_0_#000] flex flex-col items-center justify-center mt-2">
           <h2 className="text-sm font-black uppercase w-full text-center mb-6">Proporsi Aset</h2>
           <div 
             className="w-48 h-48 rounded-full border-4 border-black shadow-[4px_4px_0_0_#000] relative transition-transform active:scale-95 duration-300"
             style={{ background: pieChartBackground }}
           >
             {/* Center hole for Donut Chart effect */}
             <div className="absolute inset-0 m-auto w-24 h-24 bg-white rounded-full border-4 border-black flex flex-col items-center justify-center shadow-inner">
               <span className="text-2xl">💰</span>
               <span className="text-[10px] font-black uppercase mt-1 text-center leading-tight">Total<br/>Aset</span>
             </div>
           </div>
        </div>

        {/* Rincian Berdasarkan Aset (Horizontal Bar Chart) */}
        <div className="bg-white border-4 border-black rounded-3xl p-5 shadow-[4px_4px_0_0_#000] mt-2">
           <h2 className="text-sm font-black uppercase flex items-center justify-between border-b-2 border-black pb-3 mb-5">
             Rincian Aset
             <span className="text-xl">🧾</span>
           </h2>

           <div className="flex flex-col gap-6">
              {currentMonthData.aset.map((ast, index) => {
                 const info = ASET_LIST.find(a => a.id === ast.id);
                 if(!info) return null;
                 
                 // PersenMax digunakan untuk panjang Bar
                 const persenMax = maxAset > 0 ? (ast.total / maxAset) * 100 : 0;
                 
                 // PersenTotal digunakan untuk text informasi kontribusi (%)
                 const persenTotal = totalPemasukan > 0 ? (ast.total / totalPemasukan) * 100 : 0;

                 const barColor = PIE_COLORS[index % PIE_COLORS.length];

                 return (
                   <div key={ast.id} className="flex flex-col gap-1.5 transition-transform active:scale-[0.98] cursor-pointer">
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
                            <span>Rp {ast.total.toLocaleString('id-ID')}</span>
                            <span className="text-[9px] text-gray-500 mt-0.5">{persenTotal.toFixed(1)}% dari total</span>
                         </div>
                      </div>
                      
                      {/* Bar Horizontal Neo Brutalist */}
                      <div className="h-2 w-full bg-[#FDF8EE] border-2 border-black rounded-full overflow-hidden mt-1 shadow-inner">
                         <div 
                           className="h-full border-r-2 border-black transition-all duration-500 ease-out" 
                           style={{ width: `${Math.min(persenMax, 100)}%`, backgroundColor: barColor }}
                         ></div>
                      </div>
                   </div>
                 )
              })}
           </div>
        </div>

      </div>
    </div>
  );
}
