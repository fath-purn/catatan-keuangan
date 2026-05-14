"use client";

import { useState } from "react";
import { FiSearch, FiArrowDown, FiArrowUp, } from "react-icons/fi";
import { IoWalletOutline } from "react-icons/io5";
import MonthFilter from "@/components/month-filter";
import TransactionFilter from "@/components/transaction-filter";
import TransactionDetailModal from "@/components/transaction-detail-modal";
import clsx from "clsx";

export default function Home() {
  const data = {
    dompet: {
      saldo: "-Rp 1.000.000",
      pendapatan: "Rp 3.000.000",
      pengeluaran: "Rp 4.000.000",
      hasil: false,
    },
    transaksi: [
      {
        id: 1,
        hari: "Minggu",
        tanggal: "16",
        bulan: "Januari",
        tahun: "2026",
        totalPendapatan: "2.000.000",
        totalPengeluaran: "135.000",
        data: [
          {
            id: 1,
            jenis: "Tunjangan Hari Raya",
            nominal: "2.000.000",
            waktu: "09:00",
            kategori: "Pemasukan",
            aset: "BNI",
            mood: "Senang",
            jenis_transaksi: true,
          },
          {
            id: 2,
            jenis: "Makan Siang",
            nominal: "35.000",
            waktu: "12:00",
            kategori: "Makanan",
            aset: "BNI",
            mood: "Senang",
            jenis_transaksi: false,
          },
          {
            id: 3,
            jenis: "Baju",
            nominal: "100.000",
            waktu: "15:00",
            kategori: "Belanja",
            aset: "BNI",
            mood: "Marah",
            jenis_transaksi: false,
          }
        ]
      },
      {
        id: 2,
        hari: "Sabtu",
        tanggal: "15",
        bulan: "Januari",
        tahun: "2026",
        totalPendapatan: "0",
        totalPengeluaran: "245.000",
        data: [
          {
            id: 1,
            jenis: "Seblak",
            nominal: "35.000",
            waktu: "11:00",
            kategori: "Makanan",
            aset: "Cash",
            mood: "Senang",
            jenis_transaksi: false,
          },
          {
            id: 2,
            jenis: "Kopi Kenangan",
            nominal: "200.000",
            waktu: "15:00",
            kategori: "Makanan",
            aset: "Cash",
            mood: "Marah",
            jenis_transaksi: false,
          },
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
    ]
  }

  const [selectedTrx, setSelectedTrx] = useState<{ id: number; jenis: string; nominal: string; waktu: string; kategori: string; aset: string; mood: string; jenis_transaksi: boolean; } | null>(null);

  return (
    <main className="min-h-screen bg-gray-50 pb-0 relative">
      <div className="container mx-auto px-4 pt-6">

        {/* Header: Filter Bulan & Tombol Cari */}
        <div className="sticky top-6 z-100 flex items-center justify-between bg-white rounded-2xl p-2 px-4 shadow-sm border border-gray-100">

          {/* Filter Bulan */}
          <MonthFilter />

          {/* Tombol Cari & Filter */}
          <div className="flex items-center gap-1">
            <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors active:scale-95">
              <FiSearch className="w-5 h-5" />
            </button>
            <TransactionFilter />
          </div>

        </div>

        {/* Ringkasan Keuangan */}
        <div className="mt-6 flex flex-col gap-4">

          {/* Card Total Saldo */}
          <div className={clsx("bg-gradient-to-br rounded-3xl p-6 text-white shadow-xl relative overflow-hidden", {
            "from-red-600 to-red-800 shadow-red-600/20": !data.dompet.hasil,
            "from-green-600 to-green-800 shadow-green-600/20": data.dompet.hasil,
          })}>
            {/* Dekorasi Card */}
            < div className="absolute -right-6 -top-6 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl" ></div >
            <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-red-900 opacity-20 rounded-full blur-xl"></div>

            <div className="relative z-10">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-red-100 text-sm font-medium">Total Saldo</h2>
                <IoWalletOutline className="w-6 h-6 text-red-200" />
              </div>
              <p className="text-3xl font-extrabold tracking-tight">{data.dompet.saldo}</p>
            </div>
          </div>

          {/* Grid Pendapatan & Pengeluaran */}
          <div className="grid grid-cols-2 gap-2">

            <div className="bg-white rounded-3xl p-3 shadow-sm border border-gray-100 flex flex-col gap-2 transition-all active:scale-95">
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 bg-green-50 rounded-xl">
                  <FiArrowDown className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-gray-500 text-[11px] font-bold uppercase ">Pendapatan</h2>
              </div>
              <p className="text-lg font-bold text-gray-800">{data.dompet.pendapatan}</p>
            </div>

            <div className="bg-white rounded-3xl p-3 shadow-sm border border-gray-100 flex flex-col gap-2 transition-all active:scale-95">
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 bg-red-50 rounded-xl">
                  <FiArrowUp className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-gray-500 text-[11px] font-bold uppercase ">Pengeluaran</h2>
              </div>
              <p className="text-lg font-bold text-gray-800">{data.dompet.pengeluaran}</p>
            </div>

          </div>
        </div>

        {/* Daftar Transaksi */}
        <div className="mt-8 flex flex-col gap-6 pb-24">
          {data.transaksi.map((group) => {
            return (
              <div key={group.id} className="flex flex-col gap-3">

                {/* Header Tanggal */}
                <div className="flex justify-between items-end px-1 mb-1">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-black text-gray-800 leading-none">{group.tanggal}</span>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{group.hari}</span>
                      <span className="text-[11px] font-medium text-gray-500">{group.bulan} {group.tahun}</span>
                    </div>
                  </div>
                  {/* Total Harian */}
                  <div className="flex gap-2 text-[10px] font-bold bg-white px-2.5 py-1 rounded-full shadow-sm border border-gray-100">
                    {group.totalPendapatan !== "0" && <span className="text-green-600">+Rp {group.totalPendapatan}</span>}
                    {group.totalPendapatan !== "0" && group.totalPengeluaran !== "0" && <span className="text-gray-300">|</span>}
                    {group.totalPengeluaran !== "0" && <span className="text-gray-500">-Rp {group.totalPengeluaran}</span>}
                  </div>
                </div>

                {/* List Transaksi */}
                <div className="bg-white rounded-3xl p-2 shadow-sm border border-gray-100 flex flex-col">
                  {group.data.map((trx, index) => {

                    // Menentukan Emoji Berdasarkan Mood
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
                        className={`flex justify-between items-center p-3 transition-colors hover:bg-gray-50 cursor-pointer rounded-2xl active:scale-[0.99] ${index !== group.data.length - 1 ? 'border-b border-gray-50 border-dashed rounded-none' : ''
                          }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div className={`w-11 h-11 flex items-center justify-center rounded-2xl ${trx.jenis_transaksi ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                            }`} title={trx.kategori}>
                            {trx.jenis_transaksi ? <FiArrowDown className="w-6 h-6" /> : <FiArrowUp className="w-6 h-6" />}
                          </div>

                          <div className="flex flex-col gap-1">
                            <span className="font-bold text-gray-800 text-sm leading-none">{trx.jenis}</span>
                            <div className="flex items-center gap-1 text-[9px] font-bold text-gray-400 mt-0.5">
                              <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">{trx.waktu}</span>
                              <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">{trx.kategori}</span>
                              <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">{trx.aset}</span>
                              <span className="text-[11px] ml-0.5" title={trx.mood}>{getMoodEmoji(trx.mood)}</span>
                            </div>
                          </div>
                        </div>

                        <span className={`font-bold text-sm whitespace-nowrap ${trx.jenis_transaksi ? 'text-green-600' : 'text-gray-800'
                          }`}>
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

      </div>

      <TransactionDetailModal
        isOpen={!!selectedTrx}
        onClose={() => setSelectedTrx(null)}
        transaction={selectedTrx}
      />
    </main>
  );
}
