"use client";

import { useState } from "react";
import { FiArrowDown, FiArrowUp } from "react-icons/fi";
import TransactionDetailModal from "@/components/transaction-detail-modal";
import { Transaction } from "@/types/props";

export default function LastTransactionClient({ lastTrx }: { lastTrx: Transaction | null }) {
  const [selectedTrx, setSelectedTrx] = useState<Transaction | null>(null);

  if (!lastTrx) {
    return (
      <div className="text-center py-4 text-xs font-bold text-black/50">
        Belum ada transaksi nih!
      </div>
    );
  }

  const getMoodEmoji = (mood: string) => {
    if (mood === "Senang") return "😊";
    if (mood === "Marah") return "😡";
    if (mood === "Sedih") return "😢";
    return "😐";
  };

  const getIndonesianDateStr = (dateStr: string) => {
    if (!dateStr) return "";
    const dateObj = new Date(dateStr);
    const day = dateObj.getDate().toString();
    const indonesianMonths = [
      "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
      "Jul", "Agt", "Sep", "Okt", "Nov", "Des"
    ];
    const month = indonesianMonths[dateObj.getMonth()];
    return `${day} ${month}`;
  };

  return (
    <>
      <div
        onClick={() => setSelectedTrx(lastTrx)}
        className="flex justify-between items-center py-2 px-1 transition-transform active:scale-[0.98] cursor-pointer"
      >
        <div className="flex items-center gap-3.5">
          <div className={`w-12 h-12 border-2 border-black flex items-center justify-center rounded-xl shadow-[2px_2px_0_0_#000] ${lastTrx.jenis_transaksi ? 'bg-[#60D689]' : 'bg-[#FF7676]'}`}>
            {lastTrx.jenis_transaksi ? <FiArrowDown className="w-6 h-6 text-black" /> : <FiArrowUp className="w-6 h-6 text-black" />}
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <span className="font-black text-black text-sm leading-none">{lastTrx.jenis}</span>
              <span className="text-sm ml-0.5 drop-shadow-md" title={lastTrx.mood}>{getMoodEmoji(lastTrx.mood)}</span>
            </div>

            <div className="flex items-center gap-1.5 text-[9px] font-bold text-black mt-0.5">
              <span className="bg-[#FDF8EE] border border-black px-1.5 py-0.5 rounded shadow-[1px_1px_0_0_#000]">{lastTrx.waktu}</span>
              <span className="bg-[#FDF8EE] border border-black px-1.5 py-0.5 rounded shadow-[1px_1px_0_0_#000]">{lastTrx.kategori}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[9px] font-bold text-black mt-0.5">
              <span className="bg-[#FDF8EE] border border-black px-1.5 py-0.5 rounded shadow-[1px_1px_0_0_#000]">{lastTrx.keperluan}</span>
            </div>
          </div>
        </div>

        <span className={`font-black text-sm whitespace-nowrap px-2 ${lastTrx.jenis_transaksi ? 'text-[#3CB371]' : 'text-black'}`}>
          {lastTrx.jenis_transaksi ? `${lastTrx.nominal}` : `- ${lastTrx.nominal}`}
        </span>
      </div>

      <TransactionDetailModal
        isOpen={!!selectedTrx}
        onClose={() => setSelectedTrx(null)}
        transaction={selectedTrx}
      />
    </>
  );
}
