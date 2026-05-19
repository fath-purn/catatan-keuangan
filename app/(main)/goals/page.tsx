import Link from "next/link";
import { FiPlus, FiCalendar, FiTarget, FiEdit2 } from "react-icons/fi";
import { getGoalsData } from "@/lib/goals-data";
import { cookies } from "next/headers";
import { translations, Locale } from "@/lib/translations";

export default async function GoalsPage() {
  const data = await getGoalsData();
  const cookieStore = await cookies();
  const locale = (cookieStore.get("app_locale")?.value || "id") as Locale;
  const t = translations[locale];

  return (
    <div className="min-h-full bg-[#FDF8EE] flex flex-col relative font-sans text-black">
      {/* Header Sticky Neo-Brutalist */}
      <div className="bg-[#FF7676] px-5 pt-8 pb-6 flex items-center justify-between border-b-4 border-black shadow-[0_4px_0_0_#000] sticky top-0 z-20">
        {/* Pesan Motivasi */}
        <div className="flex flex-col gap-1 mb-2">
          <h2 className="text-2xl font-black uppercase text-black drop-shadow-[2px_2px_0_#DBCBFF]">
            {t.goals_mimpi_besar}
          </h2>
          <p className="text-xs font-bold text-gray-800 bg-white border-2 border-black px-3 py-2 w-fit rounded-xl shadow-[2px_2px_0_0_#000] -rotate-2 mt-1">
            {t.goals_motivasi_tabung}
          </p>
        </div>
      </div>

      <div className="px-5 py-6 flex flex-col gap-6">
        {/* Total Keseluruhan Goals */}
        <div className="bg-white border-4 border-black rounded-3xl p-5 shadow-[4px_4px_0_0_#000]">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2">{t.goals_total_terkumpul}</h2>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black">{data.totalTerkumpul}</span>
          </div>
          <p className="text-xs font-bold text-gray-500 mt-1">
            {t.goals_dari_total_target} <span className="text-black">{data.totalTarget}</span>
          </p>

          {/* Progress Keseluruhan */}
          <div className="h-4 w-full bg-gray-100 border-2 border-black rounded-full overflow-hidden mt-4 relative">
            <div className="absolute top-0 left-0 bottom-0 bg-black border-r-2 border-black" style={{ width: `${data.persen}%` }}></div>
          </div>
        </div>

        {/* List of Goals */}
        {data.goals.length === 0 ? (
          <div className="bg-white border-4 border-black rounded-3xl p-8 shadow-[4px_4px_0_0_#000] flex flex-col items-center justify-center text-center gap-2 mt-2">
            <span className="text-6xl drop-shadow-md mb-2">🎯</span>
            <h2 className="text-xl font-black text-black">{t.belum_ada_goals}</h2>
            <p className="text-xs font-bold text-black/60 mb-5">{t.yuk_buat_goals}</p>
            <Link href="/goals/tambah" className="bg-[#E4F087] border-2 border-black rounded-2xl px-6 py-3.5 text-sm font-black text-black shadow-[4px_4px_0_0_#000] active:scale-95 transition-transform hover:bg-[#d4e076]">
              {t.buat_goals_baru}
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {data.goals.map((goal) => (
              <div
                key={goal.id}
                className="border-2 border-black rounded-3xl p-5 shadow-[4px_4px_0_0_#000] transition-transform active:scale-[0.98]"
                style={{ backgroundColor: goal.warnaBackground }}
              >
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
                      <span className="text-[9px] uppercase opacity-70">{t.terkumpul}</span>
                      <span>{goal.terkumpul}</span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-[9px] uppercase opacity-70">{t.target}</span>
                      <span>{goal.target}</span>
                    </div>
                  </div>

                  {/* Progress Bar Item */}
                  <div className="h-6 w-full bg-white border-2 border-black rounded-full overflow-hidden relative shadow-inner mt-1">
                    <div
                      className="absolute top-0 left-0 bottom-0 bg-[#FF7676] border-r-2 border-black flex items-center justify-end px-2"
                      style={{ width: `${goal.persen}%`, backgroundColor: goal.persen >= 100 ? '#60D689' : 'black' }}
                    >
                      {goal.persen !== 0 && (
                        <span className="text-[10px] font-black text-white">{goal.persen}%</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

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

