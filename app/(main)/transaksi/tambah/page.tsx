"use client";

import { useState } from "react";
import { FiArrowLeft, FiCalendar, FiClock, FiTag, FiCreditCard, FiSmile, FiEdit2, FiChevronDown } from "react-icons/fi";
import { useRouter } from "next/navigation";
import Link from "next/link";

const KATEGORI_LIST = [
  { id: "Makanan", icon: "🍔", label: "Makanan" },
  { id: "Transportasi", icon: "🚗", label: "Transport" },
  { id: "Belanja", icon: "🛍️", label: "Belanja" },
  { id: "Tagihan", icon: "🧾", label: "Tagihan" },
  { id: "Pemasukan", icon: "💰", label: "Pemasukan" },
  { id: "Lainnya", icon: "📦", label: "Lainnya" },
];

const ASET_LIST = [
  { id: "Cash", icon: "💵", label: "Cash" },
  { id: "BNI", icon: "🏦", label: "BNI" },
  { id: "BCA", icon: "🏦", label: "BCA" },
  { id: "OVO", icon: "📱", label: "OVO" },
  { id: "Gopay", icon: "📱", label: "Gopay" },
];

// Komponen Select Kustom
function CustomSelect({ label, icon: Icon, value, onChange, options, defaultText }: any) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o: any) => o.id === value);

  return (
    <div className="flex flex-col gap-1.5 relative">
      <label className="text-xs font-bold text-gray-500 flex items-center gap-1.5 ml-1">
        <Icon className="w-4 h-4" /> {label}
      </label>
      
      {/* Overlay layar penuh untuk menutup dropdown ketika klik di luar */}
      {open && <div className="fixed inset-0 z-10" onClick={() => setOpen(false)}></div>}

      <button 
        type="button"
        onClick={() => setOpen(!open)}
        className={`relative z-20 flex items-center justify-between w-full bg-gray-50 border rounded-2xl px-4 py-3.5 text-sm font-semibold text-gray-800 transition-all active:scale-[0.98] ${
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
        <div className="absolute top-[72px] left-0 right-0 z-30 flex flex-col bg-white border border-gray-100 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] overflow-hidden max-h-56 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
          {options.map((o: any) => (
             <button
               type="button"
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

export default function TambahTransaksi() {
  const router = useRouter();

  const [jenisTransaksi, setJenisTransaksi] = useState<boolean>(false); // false = pengeluaran, true = pemasukan
  const [nominal, setNominal] = useState("");
  const [judul, setJudul] = useState("");
  const [tanggal, setTanggal] = useState(new Date().toISOString().split("T")[0]);
  const [waktu, setWaktu] = useState(new Date().toTimeString().substring(0, 5));
  const [kategori, setKategori] = useState("Makanan");
  const [aset, setAset] = useState("Cash");
  const [mood, setMood] = useState("Biasa");

  const handleNominalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Hanya ambil angka
    const val = e.target.value.replace(/[^0-9]/g, "");
    if (val) {
      setNominal(parseInt(val, 10).toLocaleString('id-ID').replace(/,/g, '.'));
    } else {
      setNominal("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Di tahap produksi, ini akan di-submit ke backend
    console.log({ jenisTransaksi, nominal, judul, tanggal, waktu, kategori, aset, mood });

    // Redirect kembali ke beranda setelah berhasil menyimpan
    router.push("/");
  };

  return (
    <div className="min-h-full bg-gray-50 flex flex-col relative">
      {/* Header Sticky */}
      <div className="bg-white px-4 pt-6 pb-4 flex items-center justify-between shadow-sm border-b border-gray-100 sticky top-0 z-20">
        <Link href="/" className="p-2 -ml-2 text-gray-500 hover:text-gray-900 bg-gray-50 rounded-full transition-colors active:scale-95">
          <FiArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-lg font-bold text-gray-800">Tambah Transaksi</h1>
        <div className="w-9"></div> {/* Spacer agar teks persis di tengah */}
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">

        {/* Toggle Pemasukan / Pengeluaran */}
        <div className="p-4 bg-white border-b border-gray-100">
          <div className="flex bg-gray-100 p-1 rounded-2xl relative">
            {/* Animasi Background Toggle */}
            <div
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-xl shadow-sm transition-all duration-300 ease-out ${jenisTransaksi ? "translate-x-full left-[4px]" : "translate-x-0 left-[4px]"
                }`}
            ></div>

            <button
              type="button"
              onClick={() => setJenisTransaksi(false)}
              className={`relative z-10 flex-1 py-2.5 text-sm font-bold rounded-xl transition-colors ${!jenisTransaksi ? "text-red-600" : "text-gray-500"
                }`}
            >
              Pengeluaran
            </button>
            <button
              type="button"
              onClick={() => setJenisTransaksi(true)}
              className={`relative z-10 flex-1 py-2.5 text-sm font-bold rounded-xl transition-colors ${jenisTransaksi ? "text-green-600" : "text-gray-500"
                }`}
            >
              Pemasukan
            </button>
          </div>
        </div>

        {/* Area Input Nominal (Besar) */}
        <div className={`p-8 mb-4 text-center transition-colors duration-300 ${jenisTransaksi ? 'bg-green-50' : 'bg-red-50'}`}>
          <p className={`text-xs font-bold mb-3 uppercase tracking-wider ${jenisTransaksi ? 'text-green-600/70' : 'text-red-600/70'}`}>
            Masukkan Nominal
          </p>
          <div className="flex items-center justify-center text-4xl font-black text-gray-800 focus-within:scale-105 transition-transform">
            <span className="mr-2 text-2xl text-gray-400">Rp</span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={nominal}
              onChange={handleNominalChange}
              className="bg-transparent border-none outline-none text-center w-[200px] placeholder-gray-300"
              required
            />
          </div>
        </div>

        {/* Form Details Area */}
        <div className="px-5 py-8 flex flex-col gap-6 bg-white flex-1 rounded-t-[32px] -mt-6 shadow-[0_-8px_30px_rgba(0,0,0,0.04)] relative z-10">

          {/* Input Keterangan Transaksi */}
          <div className="flex items-center gap-3 border-b border-gray-100 pb-3 focus-within:border-gray-300 transition-colors">
            <div className="p-3 bg-gray-50 rounded-2xl text-gray-400">
              <FiEdit2 className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Keterangan / Catatan</label>
              <input
                type="text"
                placeholder="Makan siang, bensin, dll..."
                value={judul}
                onChange={e => setJudul(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-gray-800 font-semibold placeholder-gray-300 text-base"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Input Tanggal */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-500 flex items-center gap-1.5 ml-1">
                <FiCalendar className="w-4 h-4" /> Tanggal
              </label>
              <input
                type="date"
                value={tanggal}
                onChange={e => setTanggal(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                required
              />
            </div>
            {/* Input Waktu */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-500 flex items-center gap-1.5 ml-1">
                <FiClock className="w-4 h-4" /> Waktu
              </label>
              <input
                type="time"
                value={waktu}
                onChange={e => setWaktu(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                required
              />
            </div>
          </div>

          {/* Kategori & Aset Dropdowns */}
          <div className="grid grid-cols-2 gap-4">
            <CustomSelect 
              label="Kategori"
              icon={FiTag}
              value={kategori}
              onChange={setKategori}
              options={KATEGORI_LIST}
              defaultText="Pilih Kategori"
            />
            
            <CustomSelect 
              label="Aset"
              icon={FiCreditCard}
              value={aset}
              onChange={setAset}
              options={ASET_LIST}
              defaultText="Pilih Aset"
            />
          </div>

          {/* Pemilihan Mood */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 flex items-center gap-1.5 ml-1 mb-1">
              <FiSmile className="w-4 h-4" /> Bagaimana perasaanmu?
            </label>
            <div className="flex gap-3">
              {["Senang", "Biasa", "Sedih", "Marah"].map((m) => {
                const getEmoji = (mood: string) => {
                  if (mood === "Senang") return "😊";
                  if (mood === "Marah") return "😡";
                  if (mood === "Sedih") return "😢";
                  return "😐";
                };
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMood(m)}
                    className={`flex-1 py-3.5 flex flex-col items-center justify-center gap-1.5 rounded-2xl border transition-all active:scale-95 ${mood === m
                      ? 'bg-red-50 border-red-400 text-red-700 shadow-md shadow-red-100'
                      : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300'
                      }`}
                  >
                    <span className="text-2xl leading-none drop-shadow-sm">{getEmoji(m)}</span>
                    <span className={`text-[10px] font-bold ${mood === m ? 'text-red-700' : 'text-gray-400'}`}>{m}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tombol Simpan */}
          <button
            type="submit"
            disabled={!nominal || !judul}
            className="w-full mt-4 py-4 bg-red-600 text-white font-bold rounded-2xl shadow-xl shadow-red-600/30 hover:bg-red-700 transition-all active:scale-[0.98] disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed"
          >
            Simpan Transaksi
          </button>

        </div>
      </form>
    </div>
  );
}
