export default function DashboardLoading() {
  return (
    <div className="min-h-full bg-[#FDF8EE] pb-6 relative font-sans text-black overflow-x-hidden animate-pulse">
      {/* Header Profile Skeleton */}
      <div className="bg-[#FF7676]/30 px-4 pt-8 pb-8 rounded-b-[40px] border-b-4 border-black shadow-[0_8px_0_0_#000] relative z-10">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <div className="h-3 w-12 bg-black/10 rounded-md"></div>
            <div className="h-7 w-36 bg-black/20 rounded-lg"></div>
          </div>
          <div className="w-12 h-12 bg-black/20 border-2 border-black rounded-xl shadow-[4px_4px_0_0_#000]"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8 relative z-20 flex flex-col gap-6">
        {/* Total Saldo Aset Skeleton */}
        <div className="bg-[#E4F087]/30 border-2 border-black rounded-3xl p-5 shadow-[4px_4px_0_0_#000] flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <div className="h-4 w-32 bg-black/20 rounded-md"></div>
            <div className="w-9 h-9 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0_0_#000]"></div>
          </div>
          <div className="h-10 w-48 bg-black/20 rounded-xl"></div>
        </div>

        {/* Grid Pemasukan & Pengeluaran Skeleton */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#60D689]/30 border-2 border-black rounded-3xl p-4 shadow-[4px_4px_0_0_#000] flex flex-col gap-2">
            <div className="h-4 w-16 bg-white/50 rounded-full border border-black shadow-[1px_1px_0_0_#000]"></div>
            <div className="h-6 w-24 bg-black/20 rounded-lg mt-1"></div>
          </div>
          <div className="bg-[#FF7676]/30 border-2 border-black rounded-3xl p-4 shadow-[4px_4px_0_0_#000] flex flex-col gap-2">
            <div className="h-4 w-18 bg-white/50 rounded-full border border-black shadow-[1px_1px_0_0_#000]"></div>
            <div className="h-6 w-24 bg-black/20 rounded-lg mt-1"></div>
          </div>
        </div>

        {/* Goals Skeleton */}
        <div className="bg-[#DBCBFF]/30 border-2 border-black rounded-3xl p-5 shadow-[4px_4px_0_0_#000] flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-xl opacity-50">🎯</span>
              <div className="h-5 w-24 bg-black/20 rounded-lg"></div>
            </div>
            <div className="h-6 w-28 bg-white border-2 border-black rounded-lg shadow-[2px_2px_0_0_#000]"></div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between">
              <div className="h-3.5 w-20 bg-black/10 rounded"></div>
              <div className="h-3.5 w-20 bg-black/10 rounded"></div>
            </div>
            {/* Progress Bar Skeleton */}
            <div className="h-6 w-full bg-[#FDF8EE] border-2 border-black rounded-full shadow-inner"></div>
          </div>
        </div>

        {/* Transaksi Terakhir Skeleton */}
        <div className="bg-white border-2 border-black rounded-3xl p-5 shadow-[4px_4px_0_0_#000] flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="h-5 w-32 bg-black/20 rounded-lg"></div>
            <div className="h-6 w-16 bg-[#FDF8EE] border-2 border-black rounded-lg shadow-[2px_2px_0_0_#000]"></div>
          </div>

          <div className="flex justify-between items-center py-2 px-1">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 bg-black/10 border-2 border-black rounded-xl shadow-[2px_2px_0_0_#000]"></div>
              <div className="flex flex-col gap-2">
                <div className="h-4 w-28 bg-black/20 rounded"></div>
                <div className="flex gap-1.5">
                  <div className="h-3.5 w-10 bg-black/10 rounded"></div>
                  <div className="h-3.5 w-12 bg-black/10 rounded"></div>
                </div>
              </div>
            </div>
            <div className="h-5 w-16 bg-black/20 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
