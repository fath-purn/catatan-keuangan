"use client";

import Link from "next/link";
import { FiArrowLeft, FiPlus, FiCalendar, FiTarget, FiEdit2 } from "react-icons/fi";

const GOALS_DATA = {
  totalTerkumpul: "Rp 42.500.000",
  totalTarget: "Rp 160.000.000",
  persen: 26,
  goals: [
    {
      id: "0",
      nama: "Beli iPhone 15",
      icon: "📱",
      target: "Rp 15.000.000",
      terkumpul: "Rp 5.000.000",
      persen: 33,
      tenggatWaktu: "12 Des 2026",
      warnaBackground: "bg-[#DBCBFF]",
      motivasi: "Ayo nabung lagi, biar mirror selfie makin kece! ✨",
    },
    {
      id: "2",
      nama: "Macbook Pro M4",
      icon: "💻",
      target: "Rp 25.000.000",
      terkumpul: "Rp 9.500.000",
      persen: 38,
      tenggatWaktu: "10 Jan 2027",
      warnaBackground: "bg-[#E4F087]",
      motivasi: "Biar ngoding makin ngebut, bentar lagi kebeli! 🚀",
    },
    {
      id: "4",
      nama: "DP Rumah",
      icon: "🏠",
      target: "Rp 100.000.000",
      terkumpul: "Rp 10.000.000",
      persen: 10,
      tenggatWaktu: "01 Jan 2030",
      warnaBackground: "bg-[#60D689]",
      motivasi: "Perjalanan ribuan mil dimulai dari satu langkah kecil. Semangat! 🏡",
    },
    {
      id: "5",
      nama: "Liburan Jepang",
      icon: "✈️",
      target: "Rp 20.000.000",
      terkumpul: "Rp 18.000.000",
      persen: 90,
      tenggatWaktu: "20 Agu 2026",
      warnaBackground: "bg-[#FF7676]",
      motivasi: "Wahh dikit lagi! Siap-siap packing koper ke Tokyo! 🎌",
    },
  ]
};

export default function GoalsPage() {
  return (
    <div className="min-h-full bg-[#FDF8EE] flex flex-col relative font-sans text-black">
      {/* Header Sticky Neo-Brutalist */}
      <div className="bg-[#FF7676] px-5 pt-8 pb-6 flex items-center justify-between border-b-4 border-black shadow-[0_4px_0_0_#000] sticky top-0 z-20">
        {/* Pesan Motivasi */}
        <div className="flex flex-col gap-1 mb-2">
          <h2 className="text-2xl font-black uppercase text-black drop-shadow-[2px_2px_0_#DBCBFF]">
            Mimpi Besar?
          </h2>
          <p className="text-xs font-bold text-gray-800 bg-white border-2 border-black px-3 py-2 w-fit rounded-xl shadow-[2px_2px_0_0_#000] -rotate-2 mt-1">
            Yuk tabung pelan-pelan sampai tercapai! 🚀
          </p>
        </div>
      </div>

      <div className="px-5 py-6 flex flex-col gap-6">
        {/* Total Keseluruhan Goals */}
        <div className="bg-white border-4 border-black rounded-3xl p-5 shadow-[4px_4px_0_0_#000]">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2">Total Terkumpul</h2>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black">{GOALS_DATA.totalTerkumpul}</span>
          </div>
          <p className="text-xs font-bold text-gray-500 mt-1">
            dari total target <span className="text-black">{GOALS_DATA.totalTarget}</span>
          </p>

          {/* Progress Keseluruhan */}
          <div className="h-4 w-full bg-gray-100 border-2 border-black rounded-full overflow-hidden mt-4 relative">
            <div className="absolute top-0 left-0 bottom-0 bg-black border-r-2 border-black" style={{ width: `${GOALS_DATA.persen}%` }}></div>
          </div>
        </div>

        {/* List of Goals */}
        <div className="flex flex-col gap-5">
          {GOALS_DATA.goals.map((goal) => (
            <div key={goal.id} className={`${goal.warnaBackground} border-2 border-black rounded-3xl p-5 shadow-[4px_4px_0_0_#000] transition-transform active:scale-[0.98]`}>

              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0_0_#000] flex items-center justify-center text-xl">
                    {goal.icon}
                  </div>
                  <div>
                    <h3 className="font-black text-sm uppercase">{goal.nama}</h3>
                    <div className="flex items-center gap-1 text-[10px] font-bold bg-white/60 border border-black px-1.5 py-0.5 rounded shadow-[1px_1px_0_0_#000] w-fit mt-1">
                      <FiCalendar className="w-3 h-3" />
                      {goal.tenggatWaktu}
                    </div>
                  </div>
                </div>

                <Link href={`/goals/edit/${goal.id}`} className="w-8 h-8 bg-white border-2 border-black rounded-full shadow-[2px_2px_0_0_#000] flex items-center justify-center active:scale-95 shrink-0">
                  <FiEdit2 className="w-3 h-3 text-black" />
                </Link>
              </div>

              <p className="text-[11px] font-bold text-black/80 mb-4 px-1 italic">
                "{goal.motivasi}"
              </p>

              <div className="flex flex-col gap-2 bg-white/40 p-3 rounded-2xl border-2 border-black/20">
                <div className="flex justify-between text-xs font-bold text-black">
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase opacity-70">Terkumpul</span>
                    <span>{goal.terkumpul}</span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-[9px] uppercase opacity-70">Target</span>
                    <span>{goal.target}</span>
                  </div>
                </div>

                {/* Progress Bar Item */}
                <div className="h-6 w-full bg-white border-2 border-black rounded-full overflow-hidden relative shadow-inner mt-1">
                  <div
                    className="absolute top-0 left-0 bottom-0 bg-[#FF7676] border-r-2 border-black flex items-center justify-end px-2"
                    style={{ width: `${goal.persen}%`, backgroundColor: goal.persen >= 100 ? '#60D689' : 'black' }}
                  >
                    <span className="text-[10px] font-black text-white">{goal.persen}%</span>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Floating Action Button */}
        <div className="fixed inset-0 z-30 pointer-events-none sm:max-w-[400px] sm:mx-auto sm:h-[90vh] sm:my-auto">
          <Link href="/goals/tambah" className="absolute bottom-24 right-6 w-14 h-14 flex items-center justify-center bg-[#E4F087] border-4 border-black rounded-full shadow-[4px_4px_0_0_#000] transition-transform active:translate-y-1 active:translate-x-1 active:shadow-none pointer-events-auto hover:bg-[#d4e076]">
            <FiPlus className="w-6 h-6 font-black text-black" />
          </Link>
        </div>
      </div>
    </div>
  );
}
