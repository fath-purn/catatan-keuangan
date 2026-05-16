"use client";

import { useState, Suspense } from "react";
import { FiArrowDown, FiArrowUp, FiPlus, FiChevronDown } from "react-icons/fi";
import Link from "next/link";
import TransactionDetailModal from "@/components/transaction-detail-modal";
import TransactionFilter, { TransactionTypeTabs, TransactionTimeFilter } from "@/components/transaction-filter";
import Search from "@/components/search";

export default function TransaksiPage() {
  // Data dipisah supaya mudah di-fetch dari backend nantinya
  const data = [
    {
      id: 1,
      tanggal: "14",
      hari: "Minggu",
      bulan: "Mei",
      tahun: "2026",
      totalPendapatan: "3.000.000",
      totalPengeluaran: "10.000",
      data: [
        {
          id: 1,
          jenis: "Gaji Bulanan",
          nominal: "3.000.000",
          waktu: "09:00",
          kategori: "Pemasukan",
          aset: "BCA",
          mood: "Senang",
          jenis_transaksi: true,
        },
        {
          id: 2,
          jenis: "Beli Kopi",
          nominal: "10.000",
          waktu: "10:30",
          kategori: "Makanan",
          aset: "Cash",
          mood: "Biasa",
          jenis_transaksi: false,
        }
      ]
    },
    {
      id: 2,
      tanggal: "13",
      hari: "Sabtu",
      bulan: "Mei",
      tahun: "2026",
      totalPendapatan: "0",
      totalPengeluaran: "10.000",
      data: [
        {
          id: 3,
          jenis: "Parkir",
          nominal: "10.000",
          waktu: "15:12",
          kategori: "Transportasi",
          aset: "Cash",
          mood: "Biasa",
          jenis_transaksi: false,
        }
      ]
    }
  ];

  // State untuk interaktivitas UI
  const [selectedTrx, setSelectedTrx] = useState<any | null>(null);

  return (
    <div className="min-h-full bg-[#FDF8EE] relative font-sans text-black">

      {/* Header Biru Atas (Ikut Scroll) */}
      <div className="bg-[#86B6F6] px-5 pt-8 pb-4 relative z-10">
        <div className="flex justify-between items-center">
          <div className="flex flex-col text-white drop-shadow-md">
            <h1 className="text-3xl font-black mb-1">Semua Transaksi</h1>
            <p className="text-xs font-bold opacity-90 tracking-wide">Kelola transaksi kamu di sini</p>
          </div>
          <div className="text-5xl drop-shadow-lg translate-y-2">
            🐻‍❄️
          </div>
        </div>
      </div>

      {/* Header Biru Bawah (Sticky Search Bar) */}
      <div className="sticky top-0 z-[90] bg-[#86B6F6] px-5 pb-8 pt-2 rounded-b-[40px] border-b-4 border-black shadow-[0_8px_0_0_#000] -mt-[1px]">
        {/* Search Bar */}
        <Suspense fallback={<div className="bg-white/20 border-2 border-transparent rounded-2xl flex items-center px-4 py-3 h-[48px] animate-pulse w-full"></div>}>
          <Search placeholder="Cari transaksi..." />
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
            <label className="text-[10px] font-bold text-black uppercase tracking-wider ml-1">Filter Waktu</label>
            <Suspense fallback={<div className="h-[42px] bg-white border-2 border-black rounded-xl animate-pulse"></div>}>
              <TransactionTimeFilter />
            </Suspense>
          </div>

          {/* Filter Kategori / Lanjutan */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-black uppercase tracking-wider ml-1">Filter Kategori & Lanjutan</label>
            <Suspense fallback={<div className="bg-black text-[#E4F087] border-2 border-black rounded-xl px-5 py-3 w-32 h-[42px] animate-pulse"></div>}>
              <TransactionFilter
                triggerClassName="bg-black text-[#E4F087] border-2 border-black rounded-xl px-5 py-3 text-xs font-black shadow-[2px_2px_0_0_#000] flex items-center justify-center gap-2 active:scale-95 transition-transform w-fit relative"
                triggerContent={<><span className="text-base leading-none">💰</span> Filter Lengkap</>}
              />
            </Suspense>
          </div>
        </div>

        {/* Transaction List / Empty State */}
        {data.length === 0 ? (
          /* Empty State */
          <div className="bg-white border-2 border-black rounded-3xl p-8 shadow-[4px_4px_0_0_#000] flex flex-col items-center justify-center text-center gap-2 mt-2">
            <span className="text-6xl drop-shadow-md mb-2">📫</span>
            <h2 className="text-xl font-black text-black">Belum ada transaksi</h2>
            <p className="text-xs font-bold text-black/60 mb-5">Yuk mulai catat keuanganmu!</p>
            <Link href="/transaksi/tambah" className="bg-[#DBCBFF] border-2 border-black rounded-2xl px-6 py-3.5 text-sm font-black text-black shadow-[4px_4px_0_0_#000] active:scale-95 transition-transform hover:bg-[#C9B3FF]">
              Tambah Transaksi
            </Link>
          </div>
        ) : (
          /* Daftar Transaksi (Sama seperti Beranda) */
          <div className="flex flex-col gap-6 mt-2 pb-4">
            {data.map((group) => {
              return (
                <div key={group.id} className="flex flex-col gap-3">
                  {/* Header Tanggal */}
                  <div className="flex justify-between items-end px-1 mb-1">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl font-black text-black leading-none drop-shadow-[2px_2px_0_rgba(0,0,0,0.1)]">{group.tanggal}</span>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-black uppercase tracking-wider">{group.hari}</span>
                        <span className="text-[11px] font-bold text-black/60">{group.bulan} {group.tahun}</span>
                      </div>
                    </div>
                    {/* Total Harian */}
                    <div className="flex gap-2 text-[10px] font-bold bg-white px-3 py-1.5 rounded-xl border-2 border-black shadow-[2px_2px_0_0_#000]">
                      {group.totalPendapatan !== "0" && <span className="text-[#3CB371]">+Rp {group.totalPendapatan}</span>}
                      {group.totalPendapatan !== "0" && group.totalPengeluaran !== "0" && <span className="text-black">|</span>}
                      {group.totalPengeluaran !== "0" && <span className="text-[#FF4500]">-Rp {group.totalPengeluaran}</span>}
                    </div>
                  </div>

                  {/* List Transaksi */}
                  <div className="bg-white rounded-3xl p-3 border-2 border-black shadow-[6px_6px_0_0_#000] flex flex-col overflow-hidden">
                    {group.data.map((trx, index) => {
                      const getMoodEmoji = (mood: string) => {
                        if (mood === "Senang") return "😊";
                        if (mood === "Marah") return "😡";
                        if (mood === "Sedih") return "😢";
                        return "😐";
                      };

                      return (
                        <div
                          key={trx.id}
                          onClick={() => setSelectedTrx(trx)}
                          className={`flex justify-between items-center py-3 px-1 transition-colors hover:bg-black/5 active:bg-black/10 cursor-pointer ${index !== group.data.length - 1 ? 'border-b-2 border-black/10' : ''}`}
                        >
                          <div className="flex items-center gap-3.5">
                            <div className={`w-12 h-12 border-2 border-black flex items-center justify-center rounded-xl shadow-[2px_2px_0_0_#000] ${trx.jenis_transaksi ? 'bg-[#60D689]' : 'bg-[#FF7676]'}`} title={trx.kategori}>
                              {trx.jenis_transaksi ? <FiArrowDown className="w-6 h-6 text-black" /> : <FiArrowUp className="w-6 h-6 text-black" />}
                            </div>

                            <div className="flex flex-col gap-1">
                              <span className="font-black text-black text-sm leading-none">{trx.jenis}</span>
                              <div className="flex items-center gap-1.5 text-[9px] font-bold text-black mt-0.5">
                                <span className="bg-[#FDF8EE] border border-black px-1.5 py-0.5 rounded shadow-[1px_1px_0_0_#000]">{trx.waktu}</span>
                                <span className="bg-[#FDF8EE] border border-black px-1.5 py-0.5 rounded shadow-[1px_1px_0_0_#000]">{trx.kategori}</span>
                                <span className="text-sm ml-0.5 drop-shadow-md" title={trx.mood}>{getMoodEmoji(trx.mood)}</span>
                              </div>
                            </div>
                          </div>

                          <span className={`font-black text-sm whitespace-nowrap px-2 ${trx.jenis_transaksi ? 'text-[#3CB371]' : 'text-black'}`}>
                            {trx.nominal}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      <TransactionDetailModal
        isOpen={!!selectedTrx}
        onClose={() => setSelectedTrx(null)}
        transaction={selectedTrx}
      />
    </div>
  );
}
