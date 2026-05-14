"use client";

import { useState } from "react";
import { FiFilter, FiX, FiChevronDown } from "react-icons/fi";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

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
    <div className="flex flex-col gap-2.5 relative">
      <label className="text-sm font-bold text-gray-700">{label}</label>
      
      {/* Overlay layar penuh untuk menutup dropdown ketika klik di luar */}
      {open && <div className="fixed inset-0 z-10" onClick={() => setOpen(false)}></div>}

      <button 
        type="button"
        onClick={() => setOpen(!open)}
        className={`relative z-20 flex items-center justify-between w-full bg-gray-50 border rounded-xl p-3.5 text-sm text-gray-800 transition-all ${
          open ? "border-red-500 ring-2 ring-red-500/20 bg-white" : "border-gray-200 hover:bg-gray-100"
        }`}
      >
        <span>
          {selected 
            ? (selected.icon ? `${selected.icon} ${selected.label}` : selected.label) 
            : defaultText}
        </span>
        <FiChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${open ? "rotate-180 text-red-500" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-[82px] left-0 right-0 z-30 flex flex-col bg-white border border-gray-100 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] overflow-hidden max-h-56 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
          {!hideEmpty && (
            <button
              onClick={() => { onChange(""); setOpen(false); }}
              className={`text-left px-4 py-3.5 text-sm transition-colors border-b border-gray-50 last:border-0 ${
                !value ? "bg-red-50 text-red-700 font-bold" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {defaultText}
            </button>
          )}
          {options.map((o: any) => (
             <button
               key={o.id}
               onClick={() => { onChange(o.id); setOpen(false); }}
               className={`text-left px-4 py-3.5 text-sm transition-colors border-b border-gray-50 last:border-0 ${
                 value === o.id ? "bg-red-50 text-red-700 font-bold" : "text-gray-700 hover:bg-gray-50"
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


export default function TransactionFilter() {
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
        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors active:scale-95 relative"
      >
        <FiFilter className="w-5 h-5" />
        {isFilterActive && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          <div 
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsOpen(false)}
          ></div>
          
          <div className="relative z-10 bg-white w-full rounded-t-[32px] shadow-[0_-8px_30px_rgba(0,0,0,0.12)] p-6 pb-10 flex flex-col gap-5 animate-in slide-in-from-bottom-10 duration-200">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-2"></div>
            
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-gray-800 text-xl">Filter Transaksi</h3>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 rounded-full transition-colors"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-col gap-6 overflow-y-auto no-scrollbar pb-10">
              
              {/* Jenis Transaksi */}
              <div className="flex flex-col gap-3">
                <label className="text-sm font-bold text-gray-700">Jenis Transaksi</label>
                <div className="grid grid-cols-2 gap-3">
                  {["Pemasukan", "Pengeluaran"].map(j => (
                    <button
                      key={j}
                      onClick={() => setJenis(jenis === j ? "" : j)}
                      className={`py-3.5 rounded-2xl text-sm font-semibold transition-all active:scale-95 ${
                        jenis === j 
                          ? "bg-red-600 text-white shadow-md shadow-red-600/20" 
                          : "bg-white text-gray-600 border border-gray-200 hover:border-red-300 hover:bg-red-50"
                      }`}
                    >
                      {j}
                    </button>
                  ))}
                </div>
              </div>

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
                className="w-1/3 py-3.5 rounded-xl text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors active:scale-95"
              >
                Reset
              </button>
              <button 
                onClick={handleApply}
                className="w-2/3 py-3.5 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-lg shadow-red-600/30 active:scale-95"
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
