"use client";

import { useState } from "react";
import { FiFilter, FiX, FiChevronDown, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export function TransactionTypeTabs() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const currentJenis = searchParams.get("jenis") || "Semua";

  const handleTabClick = (tab: string) => {
    const params = new URLSearchParams(searchParams);
    if (tab === "Semua") {
      params.delete("jenis");
    } else {
      params.set("jenis", tab);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex gap-1 bg-[#FDF8EE] p-1.5 rounded-2xl border-2 border-black shadow-inner">
      {["Semua", "Pemasukan", "Pengeluaran"].map((t) => {
        const isActive = currentJenis === t || (currentJenis === "" && t === "Semua");
        return (
          <button
            key={t}
            onClick={() => handleTabClick(t)}
            className={`flex-1 py-2 text-xs font-black rounded-xl transition-all ${isActive
              ? "bg-black text-[#E4F087] shadow-[2px_2px_0_0_rgba(0,0,0,0.2)]"
              : "text-black/60 hover:bg-black/5"
              }`}
          >
            {t}
          </button>
        );
      })}
    </div>
  );
}

export function TransactionTimeFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [showPicker, setShowPicker] = useState(false);
  const date = new Date();

  const currentBulanParam = searchParams.get("bulan");
  const currentTahunParam = searchParams.get("tahun");

  const currentMonth = currentBulanParam ? parseInt(currentBulanParam) - 1 : date.getMonth();
  const currentYear = currentTahunParam ? parseInt(currentTahunParam) : date.getFullYear();

  const [selectedYear, setSelectedYear] = useState(currentYear);

  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

  const getDisplayText = () => {
    if (!currentBulanParam || !currentTahunParam) return "Semua Bulan";
    return `${monthNames[currentMonth]} ${currentYear}`;
  };

  const handleSelectMonth = (monthIndex: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("bulan", (monthIndex + 1).toString());
    params.set("tahun", selectedYear.toString());
    replace(`${pathname}?${params.toString()}`);
    setShowPicker(false);
  };

  const handleReset = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("bulan");
    params.delete("tahun");
    replace(`${pathname}?${params.toString()}`);
    setShowPicker(false);
  };

  return (
    <>
      <button
        onClick={() => {
          setSelectedYear(currentYear);
          setShowPicker(true);
        }}
        className="relative flex items-center justify-between w-full bg-white border-2 border-black rounded-xl px-4 py-3 text-xs font-bold text-black shadow-[2px_2px_0_0_#000] active:scale-95 transition-transform text-left"
      >
        <span>{getDisplayText()}</span>
        <FiChevronDown className="w-4 h-4 text-black font-bold" />
      </button>

      {showPicker && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:max-w-[400px] sm:mx-auto sm:h-[90vh] sm:my-auto sm:rounded-[40px] overflow-hidden">
          <div
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setShowPicker(false)}
          ></div>

          <div className="relative z-10 bg-white w-full max-w-sm rounded-[32px] border-4 border-black shadow-[8px_8px_0_0_#000] p-6 flex flex-col gap-4 animate-in zoom-in-95 duration-200">

            <div className="flex items-center justify-between mb-2">
              <h3 className="font-black text-black text-xl uppercase">Filter Waktu</h3>
              <button
                onClick={() => setShowPicker(false)}
                className="w-8 h-8 flex items-center justify-center bg-[#FF7676] border-2 border-black rounded-full shadow-[2px_2px_0_0_#000] active:scale-95 transition-transform"
              >
                <FiX className="w-5 h-5 text-black font-bold" />
              </button>
            </div>

            {/* Pengontrol Tahun */}
            <div className="flex items-center justify-between bg-[#FDF8EE] border-2 border-black p-2 rounded-xl shadow-inner">
              <button
                onClick={() => setSelectedYear(y => y - 1)}
                className="p-2 text-black bg-white border-2 border-black shadow-[2px_2px_0_0_#000] rounded-lg active:scale-95 transition-all"
              >
                <FiChevronLeft className="w-5 h-5 font-bold" />
              </button>
              <span className="font-black text-black text-lg">{selectedYear}</span>
              <button
                onClick={() => setSelectedYear(y => y + 1)}
                className="p-2 text-black bg-white border-2 border-black shadow-[2px_2px_0_0_#000] rounded-lg active:scale-95 transition-all"
              >
                <FiChevronRight className="w-5 h-5 font-bold" />
              </button>
            </div>

            {/* Grid Bulan */}
            <div className="grid grid-cols-3 gap-3">
              {monthNames.map((m, i) => {
                const isSelected = i === currentMonth && selectedYear === currentYear && currentBulanParam;
                return (
                  <button
                    key={m}
                    onClick={() => handleSelectMonth(i)}
                    className={`py-3 rounded-xl text-xs font-black border-2 border-black shadow-[2px_2px_0_0_#000] active:scale-95 transition-transform ${isSelected
                      ? "bg-black text-[#E4F087]"
                      : "bg-white text-black hover:bg-gray-100"
                      }`}
                  >
                    {m.substring(0, 3).toUpperCase()}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleReset}
              className="mt-2 w-full py-3 rounded-xl text-xs font-black text-black bg-gray-200 border-2 border-black shadow-[2px_2px_0_0_#000] hover:bg-gray-300 transition-colors active:scale-95"
            >
              Semua Bulan (Reset)
            </button>
          </div>
        </div>
      )}
    </>
  );
}

const KATEGORI_LIST = [
  { id: "Makanan", icon: "🍔", label: "Makanan & Minuman" },
  { id: "Transportasi", icon: "🚗", label: "Transportasi" },
  { id: "Hiburan", icon: "🎮", label: "Hiburan" },
  { id: "Belanja", icon: "🛍️", label: "Belanja" },
  { id: "Tagihan", icon: "🧾", label: "Tagihan & Utilitas" },
  { id: "Lainnya", icon: "📦", label: "Lainnya" },
];

const MOOD_LIST = [
  { id: "Senang", icon: "😊", label: "Senang" },
  { id: "Biasa", icon: "😐", label: "Biasa" },
  { id: "Sedih", icon: "😢", label: "Sedih" },
  { id: "Marah", icon: "😡", label: "Marah" },
];

const SORT_LIST = [
  { id: "terbaru", icon: "🗓️", label: "Terbaru (Menurun)" },
  { id: "terlama", icon: "🗓️", label: "Terlama (Menaik)" },
  { id: "tertinggi", icon: "💰", label: "Nominal Tertinggi" },
  { id: "terendah", icon: "💰", label: "Nominal Terendah" },
];

// Komponen Select Kustom
function CustomSelect({ label, value, onChange, options, defaultText, hideEmpty = false }: any) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o: any) => o.id === value);

  return (
    <div className="flex flex-col gap-1.5 relative">
      <label className="text-[10px] font-bold text-black uppercase tracking-wider ml-1">{label}</label>

      {/* Overlay layar penuh untuk menutup dropdown ketika klik di luar */}
      {open && <div className="fixed inset-0 z-10" onClick={() => setOpen(false)}></div>}

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`relative z-20 flex items-center justify-between w-full bg-white border-2 border-black rounded-xl p-3 text-xs font-bold text-black shadow-[2px_2px_0_0_#000] transition-transform active:scale-95`}
      >
        <span>
          {selected
            ? (selected.icon ? `${selected.icon} ${selected.label}` : selected.label)
            : defaultText}
        </span>
        <FiChevronDown className={`w-4 h-4 text-black font-bold transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-14 left-0 right-0 z-30 flex flex-col bg-white border-2 border-black rounded-xl shadow-[4px_4px_0_0_#000] overflow-hidden max-h-56 overflow-y-auto animate-in zoom-in-95 duration-150">
          {!hideEmpty && (
            <button
              onClick={() => { onChange(""); setOpen(false); }}
              className={`text-left px-4 py-3 text-xs font-bold transition-colors border-b-2 border-black last:border-0 ${!value ? "bg-black text-[#E4F087]" : "text-black hover:bg-gray-100"
                }`}
            >
              {defaultText}
            </button>
          )}
          {options.map((o: any) => (
            <button
              key={o.id}
              onClick={() => { onChange(o.id); setOpen(false); }}
              className={`text-left px-4 py-3 text-xs font-bold transition-colors border-b-2 border-black last:border-0 ${value === o.id ? "bg-black text-[#E4F087]" : "text-black hover:bg-gray-100"
                }`}
            >
              {o.icon && <span className="mr-2">{o.icon}</span>}
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


export default function TransactionFilter({ triggerClassName, triggerContent }: { triggerClassName?: string, triggerContent?: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [kategori, setKategori] = useState(searchParams.get("kategori") || "");
  const [mood, setMood] = useState(searchParams.get("mood") || "");
  const [jenis, setJenis] = useState(searchParams.get("jenis") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "terbaru");

  const isFilterActive = !!searchParams.get("kategori") || !!searchParams.get("mood") || !!searchParams.get("jenis") || (searchParams.get("sort") && searchParams.get("sort") !== "terbaru");

  const handleApply = () => {
    const params = new URLSearchParams(searchParams);

    if (kategori) params.set("kategori", kategori);
    else params.delete("kategori");

    if (mood) params.set("mood", mood);
    else params.delete("mood");

    if (jenis) params.set("jenis", jenis);
    else params.delete("jenis");

    if (sort) params.set("sort", sort);
    else params.delete("sort");

    replace(`${pathname}?${params.toString()}`);
    setIsOpen(false);
  };

  const handleReset = () => {
    setKategori("");
    setMood("");
    setJenis("");
    setSort("terbaru");
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={triggerClassName || "w-8 h-8 flex items-center justify-center bg-white border-2 border-black rounded-xl shadow-[2px_2px_0_0_#000] active:scale-95 transition-transform relative"}
      >
        {triggerContent || <FiFilter className="w-4 h-4 text-black font-bold" />}
        {isFilterActive && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#FF7676] rounded-full border border-black"></span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          ></div>

          <div className="relative z-10 bg-white w-full max-w-sm rounded-[32px] border-4 border-black shadow-[8px_8px_0_0_#000] p-6 flex flex-col gap-5 animate-in zoom-in-95 duration-200">

            <div className="flex items-center justify-between mb-2">
              <h3 className="font-black text-black text-xl uppercase">Filter Transaksi</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center bg-[#FF7676] border-2 border-black rounded-full shadow-[2px_2px_0_0_#000] active:scale-95 transition-transform"
              >
                <FiX className="w-5 h-5 text-black font-bold" />
              </button>
            </div>

            <div className="flex flex-col gap-6 max-h-[60vh] overflow-y-auto no-scrollbar pb-2">

              {/* Jenis Transaksi */}
              {/* Kategori - Custom Select */}
              <CustomSelect
                label="Kategori"
                value={kategori}
                onChange={setKategori}
                options={KATEGORI_LIST}
                defaultText="Semua Kategori"
              />

              {/* Mood - Custom Select */}
              <CustomSelect
                label="Mood"
                value={mood}
                onChange={setMood}
                options={MOOD_LIST}
                defaultText="Semua Mood"
              />

              {/* Urutkan - Custom Select */}
              <CustomSelect
                label="Urutkan"
                value={sort}
                onChange={setSort}
                options={SORT_LIST}
                defaultText=""
                hideEmpty={true}
              />

            </div>

            <div className="flex gap-3 mt-2">
              <button
                onClick={handleReset}
                className="w-1/3 py-3 rounded-xl text-xs font-black text-black bg-gray-200 border-2 border-black shadow-[2px_2px_0_0_#000] hover:bg-gray-300 transition-colors active:scale-95"
              >
                Reset
              </button>
              <button
                onClick={handleApply}
                className="w-2/3 py-3 rounded-xl text-xs font-black text-black bg-[#E4F087] border-2 border-black shadow-[2px_2px_0_0_#000] hover:bg-[#d4e076] transition-colors active:scale-95"
              >
                Terapkan
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
