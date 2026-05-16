"use client";

import { FiArrowLeft, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Link from "next/link";
import { useState } from "react";

const KATEGORI_LIST = [
  { id: "Makanan", icon: "🍔", label: "Makanan" },
  { id: "Transportasi", icon: "🚗", label: "Transport" },
  { id: "Belanja", icon: "🛍️", label: "Belanja" },
  { id: "Tagihan", icon: "🧾", label: "Tagihan" },
  { id: "Pemasukan", icon: "💰", label: "Pemasukan" },
  { id: "Lainnya", icon: "📦", label: "Lainnya" },
];

const data = [
  {
    periode: "Mei 2026",
    grafik: [
      { minggu: "Mg 1", pengeluaran: 500000, pemasukan: 0 },
      { minggu: "Mg 2", pengeluaran: 770000, pemasukan: 3000000 },
      { minggu: "Mg 3", pengeluaran: 400000, pemasukan: 0 },
      { minggu: "Mg 4", pengeluaran: 900000, pemasukan: 0 },
    ],
    kategori: [
      { id: "Makanan", total: 1200000 },
      { id: "Transportasi", total: 400000 },
      { id: "Belanja", total: 500000 },
      { id: "Tagihan", total: 470000 },
    ]
  },
  {
    periode: "April 2026",
    grafik: [
      { minggu: "Mg 1", pengeluaran: 600000, pemasukan: 0 },
      { minggu: "Mg 2", pengeluaran: 400000, pemasukan: 3000000 },
      { minggu: "Mg 3", pengeluaran: 800000, pemasukan: 0 },
      { minggu: "Mg 4", pengeluaran: 500000, pemasukan: 0 },
    ],
    kategori: [
      { id: "Makanan", total: 900000 },
      { id: "Transportasi", total: 400000 },
      { id: "Belanja", total: 500000 },
      { id: "Tagihan", total: 500000 },
    ]
  }
];

export default function LaporanBulanan() {
  const [monthOffset, setMonthOffset] = useState(0);

  // Perhitungan berdasarkan data array saat ini
  const currentMonthData = data[Math.abs(monthOffset)] || data[0];
  const totalPengeluaran = currentMonthData.grafik.reduce((acc, curr) => acc + curr.pengeluaran, 0);
  const totalPemasukan = currentMonthData.grafik.reduce((acc, curr) => acc + curr.pemasukan, 0);
  const maxPengeluaran = Math.max(...currentMonthData.grafik.map(d => d.pengeluaran));

  return (
    <div className="min-h-full bg-[#FDF8EE] flex flex-col relative font-sans text-black pb-10">

      {/* Header Sticky Neo-Brutalist (Warna Oren untuk Bulanan) */}
      <div className="bg-[#FFB443] px-5 pt-8 pb-6 flex items-center justify-between border-b-4 border-black shadow-[0_4px_0_0_#000] sticky top-0 z-20">
        <Link href="/profile" className="w-10 h-10 flex items-center justify-center bg-white border-2 border-black rounded-full shadow-[2px_2px_0_0_#000] transition-transform active:scale-95">
          <FiArrowLeft className="w-5 h-5 font-black text-black" />
        </Link>
        <h1 className="text-xl font-black text-black uppercase">Bulanan</h1>
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

        {/* Ringkasan */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#FF7676] border-4 border-black rounded-3xl p-4 shadow-[4px_4px_0_0_#000] flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase bg-white/50 px-2 py-1 border border-black rounded shadow-[2px_2px_0_0_#000] w-fit mb-4">Pengeluaran</span>
            <p className="text-lg font-black leading-tight">Rp {totalPengeluaran.toLocaleString('id-ID')}</p>
          </div>
          <div className="bg-[#60D689] border-4 border-black rounded-3xl p-4 shadow-[4px_4px_0_0_#000] flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase bg-white/50 px-2 py-1 border border-black rounded shadow-[2px_2px_0_0_#000] w-fit mb-4">Pemasukan</span>
            <p className="text-lg font-black leading-tight">Rp {totalPemasukan.toLocaleString('id-ID')}</p>
          </div>
        </div>

        {/* Bar Chart CSS */}
        <div className="bg-white border-4 border-black rounded-3xl p-5 shadow-[4px_4px_0_0_#000]">
          <h2 className="text-sm font-black uppercase mb-6 flex items-center justify-between">
            Grafik Pengeluaran
            <span className="text-xl">📉</span>
          </h2>

          <div className="flex justify-between items-end h-56 border-b-4 border-black pb-2 gap-4 relative">
            {/* Garis Horizontal Bantuan (opsional) */}
            <div className="absolute top-0 left-0 right-0 border-t-2 border-dashed border-gray-300 pointer-events-none"></div>
            <div className="absolute top-1/2 left-0 right-0 border-t-2 border-dashed border-gray-300 pointer-events-none"></div>

            {currentMonthData.grafik.map(d => (
              <div key={d.minggu} className="flex flex-col items-center gap-2 w-full h-full justify-end group cursor-pointer">
                {/* Bar */}
                <div
                  className="w-full bg-[#FF7676] border-2 border-black rounded-t-lg relative transition-all group-hover:bg-[#FF5555] group-active:scale-95 origin-bottom z-10 shadow-[2px_0_0_0_#000]"
                  style={{ height: `${(d.pengeluaran / maxPengeluaran) * 100}%`, minHeight: '15%' }}
                >
                  {/* Tooltip Hover (Tampil di atas bar saat di-hover) */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-[#E4F087] text-[10px] font-bold px-2 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 shadow-[2px_2px_0_0_#E4F087]">
                    {d.pengeluaran / 1000}k
                    {/* Panah bawah tooltip */}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-black"></div>
                  </div>
                </div>
                {/* Label Minggu */}
                <span className="text-[10px] font-black uppercase text-black">
                  {d.minggu}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between text-[10px] font-bold text-black/70 bg-gray-50 border-2 border-black rounded-xl px-3 py-2">
            <span>Rata-rata Pengeluaran</span>
            <span className="text-black text-xs">Rp {Math.round(totalPengeluaran / 4).toLocaleString('id-ID')} / minggu</span>
          </div>
        </div>

        {/* Rincian Kategori */}
        <div className="bg-white border-4 border-black rounded-3xl p-5 shadow-[4px_4px_0_0_#000]">
          <h2 className="text-sm font-black uppercase flex items-center justify-between border-b-2 border-black pb-3 mb-4">
            Rincian Kategori
            <span className="text-xl">🍔</span>
          </h2>

          <div className="flex flex-col gap-4">
            {currentMonthData.kategori.map((kat) => {
              const info = KATEGORI_LIST.find(k => k.id === kat.id);
              if (!info) return null;
              // Cari persentase untuk progress bar kecil
              const persen = totalPengeluaran > 0 ? (kat.total / totalPengeluaran) * 100 : 0;

              return (
                <div key={kat.id} className="flex flex-col gap-1.5 transition-transform active:scale-[0.98] cursor-pointer">
                  <div className="flex justify-between items-center text-xs font-bold text-black">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#FDF8EE] border-2 border-black rounded-lg p-1 w-8 h-8 flex items-center justify-center text-sm shadow-[2px_2px_0_0_#000]">
                        {info.icon}
                      </span>
                      <span className="uppercase">{info.label}</span>
                    </div>
                    <span>Rp {kat.total.toLocaleString('id-ID')}</span>
                  </div>
                  {/* Mini Progress Bar */}
                  <div className="h-2 w-full bg-[#FDF8EE] border-2 border-black rounded-full overflow-hidden mt-1 shadow-inner">
                    <div className="h-full bg-[#FFB443] border-r-2 border-black" style={{ width: `${Math.min(persen, 100)}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
