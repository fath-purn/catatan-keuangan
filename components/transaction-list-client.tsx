"use client";

import { useState } from "react";
import { FiArrowDown, FiArrowUp } from "react-icons/fi";
import Link from "next/link";
import TransactionDetailModal from "@/components/transaction-detail-modal";
import { FullTransaction, Transaction } from "@/types/props";

export default function TransactionListClient({ data }: { data: FullTransaction[] }) {
  const [selectedTrx, setSelectedTrx] = useState<Transaction | null>(null);

  if (data.length === 0) {
    return (
      <div className="bg-white border-2 border-black rounded-3xl p-8 shadow-[4px_4px_0_0_#000] flex flex-col items-center justify-center text-center gap-2 mt-2">
        <span className="text-6xl drop-shadow-md mb-2">📫</span>
        <h2 className="text-xl font-black text-black">Belum ada transaksi</h2>
        <p className="text-xs font-bold text-black/60 mb-5">Yuk mulai catat keuanganmu!</p>
        <Link href="/transaksi/tambah" className="bg-[#DBCBFF] border-2 border-black rounded-2xl px-6 py-3.5 text-sm font-black text-black shadow-[4px_4px_0_0_#000] active:scale-95 transition-transform hover:bg-[#C9B3FF]">
          Tambah Transaksi
        </Link>
      </div>
    );
  }

  return (
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
              {group.data.map((trx: any, index: number) => {
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

                      <div className="flex flex-col gap-1 min-w-0">
                        <div className="flex items-center gap-1 min-w-0">
                          <span className="font-black text-black text-sm leading-none truncate max-w-[130px]" title={trx.jenis}>{trx.jenis}</span>
                          <span className="text-sm ml-0.5 drop-shadow-md shrink-0" title={trx.mood}>{getMoodEmoji(trx.mood)}</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-black mt-0.5">
                          <span className="bg-[#FDF8EE] border border-black px-1.5 py-0.5 rounded shadow-[1px_1px_0_0_#000]">{trx.keperluan}</span>
                          <span className="bg-[#FDF8EE] border border-black px-1.5 py-0.5 rounded shadow-[1px_1px_0_0_#000]">{trx.kategori}</span>
                        </div>
                      </div>
                    </div>

                    <span className={`font-black text-sm whitespace-nowrap px-2 ${trx.jenis_transaksi ? 'text-[#3CB371]' : 'text-black'}`}>
                      {trx.jenis_transaksi ? `${trx.nominal}` : `- ${trx.nominal}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      <TransactionDetailModal
        isOpen={!!selectedTrx}
        onClose={() => setSelectedTrx(null)}
        transaction={selectedTrx}
      />
    </div>
  );
}
