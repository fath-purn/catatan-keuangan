"use client";

import { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight, FiChevronDown, FiX } from "react-icons/fi";
import { format, addMonths, subMonths, setMonth, setYear, getMonth, getYear } from "date-fns";
import { id } from "date-fns/locale"; // Locale Indonesia untuk format penamaan bulan
import { useSearchParams, usePathname, useRouter } from "next/navigation";

// Generate array [0, 1, 2, ..., 11]
const MONTH_INDICES = Array.from({ length: 12 }, (_, i) => i);

export default function MonthFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Inisialisasi tanggal dari parameter URL jika ada, jika tidak pakai hari ini
  const getInitialDate = () => {
    const monthParam = searchParams.get("month");
    const yearParam = searchParams.get("year");

    if (monthParam && yearParam) {
      const d = new Date();
      d.setFullYear(Number(yearParam));
      d.setMonth(Number(monthParam) - 1);
      return d;
    }
    return new Date();
  };

  const [currentDate, setCurrentDate] = useState(getInitialDate());
  const [showPicker, setShowPicker] = useState(false);
  const [selectedYear, setSelectedYear] = useState(getYear(currentDate));

  const updateDate = (newDate: Date) => {
    setCurrentDate(newDate);
    const params = new URLSearchParams(searchParams);
    // Simpan bulan (1-12) dan tahun
    params.set("bulan", (getMonth(newDate) + 1).toString());
    params.set("tahun", getYear(newDate).toString());
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handlePrevMonth = () => updateDate(subMonths(currentDate, 1));
  const handleNextMonth = () => updateDate(addMonths(currentDate, 1));

  const handleSelectMonth = (monthIndex: number) => {
    // Set tahun & bulan berdasarkan pilihan
    const newDate = setMonth(setYear(currentDate, selectedYear), monthIndex);
    updateDate(newDate);
    setShowPicker(false);
  };

  return (
    <>
      <div className="flex items-center gap-1">
        <button
          onClick={handlePrevMonth}
          className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
        >
          <FiChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={() => {
            setSelectedYear(getYear(currentDate));
            setShowPicker(true);
          }}
          className="flex items-center justify-center gap-1.5 font-semibold text-gray-800 text-sm min-w-[120px] hover:bg-gray-50 py-1.5 px-2 rounded-lg transition-colors select-none active:scale-95 capitalize"
        >
          <span>{format(currentDate, "MMMM yyyy", { locale: id })}</span>
          <FiChevronDown className="w-4 h-4 text-gray-400" />
        </button>

        <button
          onClick={handleNextMonth}
          className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
        >
          <FiChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Popup Picker */}
      {showPicker && (
        <div className="absolute inset-0 z-50 flex flex-col justify-center items-center p-4">
          {/* Overlay Click outside */}
          <div
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setShowPicker(false)}
          ></div>

          {/* Centered Modal */}
          <div className="relative z-10 bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 flex flex-col gap-2 border border-gray-100">

            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-gray-800 text-xl">Pilih Bulan</h3>
              <button
                onClick={() => setShowPicker(false)}
                className="p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 rounded-full transition-colors"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {/* Pengontrol Tahun */}
            <div className="flex items-center justify-between bg-gray-50 p-2 rounded-2xl border border-gray-100 mb-4">
              <button
                onClick={() => setSelectedYear(y => y - 1)}
                className="p-2 text-gray-500 hover:bg-white hover:text-gray-800 hover:shadow-sm rounded-xl transition-all active:scale-95"
              >
                <FiChevronLeft className="w-5 h-5" />
              </button>
              <span className="font-bold text-gray-800 text-lg">{selectedYear}</span>
              <button
                onClick={() => setSelectedYear(y => y + 1)}
                className="p-2 text-gray-500 hover:bg-white hover:text-gray-800 hover:shadow-sm rounded-xl transition-all active:scale-95"
              >
                <FiChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Grid Bulan */}
            <div className="grid grid-cols-4 gap-3">
              {MONTH_INDICES.map((monthIndex) => {
                // Mendapatkan singkatan nama bulan (contoh: "Jan", "Feb") lewat date-fns
                const tempDate = setMonth(new Date(), monthIndex);
                const shortMonthName = format(tempDate, "MMM", { locale: id });

                const isSelected = monthIndex === getMonth(currentDate) && selectedYear === getYear(currentDate);

                return (
                  <button
                    key={monthIndex}
                    onClick={() => handleSelectMonth(monthIndex)}
                    className={`py-3 rounded-2xl text-sm font-semibold transition-all active:scale-95 capitalize ${isSelected
                        ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                        : "bg-white text-gray-600 border border-gray-200 hover:border-red-300 hover:bg-red-50"
                      }`}
                  >
                    {shortMonthName}
                  </button>
                )
              })}
            </div>

          </div>
        </div>
      )}
    </>
  );
}
