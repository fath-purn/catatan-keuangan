"use client";

import { useState, Suspense } from "react";
import { FiArrowDown, FiArrowUp, } from "react-icons/fi";
import { IoWalletOutline } from "react-icons/io5";
import TransactionFilter from "@/components/transaction-filter";
import TransactionDetailModal from "@/components/transaction-detail-modal";
import Link from "next/link";
import clsx from "clsx";

export default function Home() {
  const data = {
    dompet: {
      saldo: "Rp 15.000.000",
      pendapatan: "Rp 3.876.000",
      pengeluaran: "Rp 10.000",
      hasil: true
    },
    goals: {
      nama: "Macbook Pro M4",
      persen: 38,
      terkumpul: "Rp 9.5jt",
      target: "Rp 25jt",
    },
    transaksi: [
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
    ]
  }

  const [selectedTrx, setSelectedTrx] = useState<{ id: number; jenis: string; nominal: string; waktu: string; kategori: string; aset: string; mood: string; jenis_transaksi: boolean; } | null>(null);

  const lastGroup = data.transaksi[0];
  const lastTrx = lastGroup?.data[0] ? { ...lastGroup.data[0], tanggal: lastGroup.tanggal, bulan: lastGroup.bulan, tahun: lastGroup.tahun } : null;

  return (
    <div className="min-h-full bg-[#FDF8EE] pb-2 relative font-sans text-black overflow-x-hidden">
      {/* Header Profile */}
      <div className="bg-[#FF7676] px-4 pt-8 pb-8 rounded-b-[40px] border-b-4 border-black shadow-[0_8px_0_0_#000] relative z-10">
        <div className="flex justify-between items-center">
          <div className="flex flex-col text-white">
            <span className="text-xs font-bold uppercase tracking-wider text-black drop-shadow-sm">Halo,</span>
            <h1 className="text-2xl font-black drop-shadow-md">Aretha! 👋</h1>
          </div>
          <div className="w-12 h-12 bg-[#DBCBFF] border-2 border-black rounded-xl shadow-[4px_4px_0_0_#000] overflow-hidden flex items-center justify-center text-2xl">
            👦🏻
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8 relative z-20 flex flex-col gap-6">

        {/* Informasi Saldo dari Semua Aset */}
        <div className="bg-[#E4F087] border-2 border-black rounded-3xl p-5 shadow-[4px_4px_0_0_#000] flex flex-col transition-transform active:scale-95">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm font-bold text-black uppercase tracking-tight">Total Saldo Aset</h2>
            <div className="p-2 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0_0_#000]">
              <IoWalletOutline className="w-5 h-5 text-black" />
            </div>
          </div>
          <p className="text-4xl font-black drop-shadow-[2px_2px_0_rgba(0,0,0,0.1)] truncate">{data.dompet.saldo}</p>
        </div>

        {/* Pengeluaran & Pemasukan Bulan Ini */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#60D689] border-2 border-black rounded-3xl p-4 shadow-[4px_4px_0_0_#000] flex flex-col justify-center transition-transform active:scale-95">
            <h2 className="text-black text-[10px] font-bold uppercase mb-1 bg-white/50 w-fit px-2 py-0.5 rounded-full border border-black shadow-[1px_1px_0_0_#000]">Pemasukan</h2>
            <p className="text-lg font-black truncate drop-shadow-sm mt-1">{data.dompet.pendapatan}</p>
          </div>
          <div className="bg-[#FF7676] border-2 border-black rounded-3xl p-4 shadow-[4px_4px_0_0_#000] flex flex-col justify-center transition-transform active:scale-95">
            <h2 className="text-black text-[10px] font-bold uppercase mb-1 bg-white/50 w-fit px-2 py-0.5 rounded-full border border-black shadow-[1px_1px_0_0_#000]">Pengeluaran</h2>
            <p className="text-lg font-black truncate drop-shadow-sm mt-1">{data.dompet.pengeluaran}</p>
          </div>
        </div>

        {/* Tampilan Goals */}
        <div className="bg-[#DBCBFF] border-2 border-black rounded-3xl p-5 shadow-[4px_4px_0_0_#000]">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl drop-shadow-md">🎯</span>
              <h2 className="font-black text-sm uppercase">Goals Kamu</h2>
            </div>
            <span className="text-[10px] font-bold px-2 py-1 bg-white border-2 border-black rounded-lg shadow-[2px_2px_0_0_#000]">{data.goals.nama}</span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs font-bold text-black/80">
              <span>Terkumpul: {data.goals.terkumpul}</span>
              <span>Target: {data.goals.target}</span>
            </div>
            {/* Progress Bar Neo-brutalist */}
            <div className="h-6 w-full bg-[#FDF8EE] border-2 border-black rounded-full overflow-hidden relative shadow-inner">
              <div className="absolute top-0 left-0 bottom-0 bg-[#E4F087] border-r-2 border-black flex items-center justify-end px-2" style={{ width: data.goals.persen + '%' }}>
                <span className="text-[10px] font-black text-black">{data.goals.persen}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 1 Transaksi Terakhir */}
        <div className="bg-white border-2 border-black rounded-3xl p-5 shadow-[4px_4px_0_0_#000]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-black text-sm uppercase">Transaksi Terakhir</h2>
            <Link href="/transaksi" className="text-[10px] font-bold px-2 py-1 bg-[#FDF8EE] border-2 border-black rounded-lg shadow-[2px_2px_0_0_#000] hover:bg-[#E4F087] transition-colors">
              Lihat Semua
            </Link>
          </div>

          {lastTrx ? (
            <div
              onClick={() => setSelectedTrx(lastTrx as any)}
              className="flex justify-between items-center py-2 px-1 transition-transform active:scale-[0.98] cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className={`w-12 h-12 border-2 border-black flex items-center justify-center rounded-xl shadow-[2px_2px_0_0_#000] ${lastTrx.jenis_transaksi ? 'bg-[#60D689]' : 'bg-[#FF7676]'}`}>
                  {lastTrx.jenis_transaksi ? <FiArrowDown className="w-6 h-6 text-black" /> : <FiArrowUp className="w-6 h-6 text-black" />}
                </div>

                <div className="flex flex-col gap-1">
                  <span className="font-black text-black text-sm leading-none">{lastTrx.jenis}</span>
                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-black mt-0.5">
                    <span className="bg-[#FDF8EE] border border-black px-1.5 py-0.5 rounded shadow-[1px_1px_0_0_#000]">{lastTrx.tanggal} {lastTrx.bulan}</span>
                    <span className="bg-[#FDF8EE] border border-black px-1.5 py-0.5 rounded shadow-[1px_1px_0_0_#000]">{lastTrx.kategori}</span>
                  </div>
                </div>
              </div>

              <span className={`font-black text-sm whitespace-nowrap px-2 ${lastTrx.jenis_transaksi ? 'text-[#3CB371]' : 'text-black'}`}>
                {lastTrx.nominal}
              </span>
            </div>
          ) : (
            <div className="text-center py-4 text-xs font-bold text-black/50">
              Belum ada transaksi nih!
            </div>
          )}
        </div>

      </div>

      <TransactionDetailModal
        isOpen={!!selectedTrx}
        onClose={() => setSelectedTrx(null)}
        transaction={selectedTrx}
      />
    </div>
  );
}
