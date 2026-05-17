import { Suspense } from "react";
import { IoWalletOutline } from "react-icons/io5";
import Link from "next/link";
import { getDashboardData } from "@/lib/data";
import LastTransactionClient from "@/components/last-transaction-client";
import DashboardLoading from "./loading";

export default function Home() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent />
    </Suspense>
  );
}

async function DashboardContent() {
  const data = await getDashboardData();

  return (
    <div className="min-h-full bg-[#FDF8EE] pb-2 relative font-sans text-black overflow-x-hidden">
      {/* Header Profile */}
      <div className="bg-[#FF7676] px-4 pt-8 pb-8 rounded-b-[40px] border-b-4 border-black shadow-[0_8px_0_0_#000] relative z-10">
        <div className="flex justify-between items-center">
          <div className="flex flex-col text-white">
            <span className="text-xs font-bold uppercase tracking-wider text-black drop-shadow-sm">Halo,</span>
            <h1 className="text-2xl font-black drop-shadow-md">{data.name}! 👋</h1>
          </div>
          <div className="w-12 h-12 bg-[#DBCBFF] border-2 border-black rounded-xl shadow-[4px_4px_0_0_#000] overflow-hidden flex items-center justify-center text-2xl">
            {data.avatar}
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
        {data.goals ? (
          <Link href="/goals" className="bg-[#DBCBFF] border-2 border-black rounded-3xl p-5 shadow-[4px_4px_0_0_#000]">
            <div className="flex justify-between items-center mb-4">
              <div className="flex justify-center items-center gap-2">
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
                  {data.goals.persen !== 0 && (
                    <span className="text-[10px] font-black text-black">{data.goals.persen}%</span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ) : (
          <div className="bg-[#DBCBFF] border-2 border-black rounded-3xl p-5 shadow-[4px_4px_0_0_#000] flex flex-col items-center justify-center text-center gap-2">
            <span className="text-4xl drop-shadow-md">🎯</span>
            <h2 className="font-black text-sm uppercase">Belum ada Goals</h2>
            <p className="text-xs font-bold text-black/60">Yuk buat target tabungan impianmu!</p>
            <Link href="/goals/tambah" className="mt-2 bg-white border-2 border-black px-4 py-2 rounded-xl text-xs font-black shadow-[2px_2px_0_0_#000] active:scale-95 transition-transform hover:bg-[#FDF8EE]">
              Buat Goals Baru
            </Link>
          </div>
        )}

        {/* 1 Transaksi Terakhir */}
        <div className="bg-white border-2 border-black rounded-3xl p-5 shadow-[4px_4px_0_0_#000] mb-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-black text-sm uppercase">Transaksi Terakhir</h2>
            <Link href="/transaksi" className="text-[10px] font-bold px-2 py-1 bg-[#FDF8EE] border-2 border-black rounded-lg shadow-[2px_2px_0_0_#000] hover:bg-[#E4F087] transition-colors">
              Lihat Semua
            </Link>
          </div>

          <LastTransactionClient lastTrx={data.transaksi?.[0]?.data?.[0] ?? null} />
        </div>

      </div>
    </div>
  );
}
