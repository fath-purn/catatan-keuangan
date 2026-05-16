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

const JENIS_TRANSAKSI = [
  { id: "Goals", icon: "🎯", label: "Goals" },
  { id: "Impulsif", icon: "🛍️", label: "Impulsif" },
  { id: "Kebutuhan", icon: "🛒", label: "Kebutuhan" },
  { id: "Emergency", icon: "🆘", label: "Emergency" },
];

const GOALS_LIST = [
  { id: "1", icon: "📱", label: "Beli iPhone 15" },
  { id: "2", icon: "💻", label: "Macbook Pro" },
  { id: "3", icon: "🏍️", label: "Motor Baru" },
  { id: "4", icon: "🏠", label: "DP Rumah" },
  { id: "5", icon: "✈️", label: "Liburan Jepang" },
  { id: "6", icon: "🎓", label: "S2" },
  { id: "7", icon: "💍", label: "Nikah" },
];

// Komponen Select Kustom Neo-Brutalist
function CustomSelect({ label, icon: Icon, value, onChange, options, defaultText }: any) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const selected = options.find((o: any) => o.id === value);

  const filteredOptions = options.filter((o: any) =>
    o.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => setSearchQuery(""), 200);
  };

  return (
    <div className="flex flex-col gap-1.5 relative">
      <label className="text-[10px] font-bold text-black uppercase tracking-wider ml-1 flex items-center gap-1">
        <Icon className="w-3 h-3" /> {label}
      </label>

      {/* Overlay layar penuh untuk menutup dropdown ketika klik di luar */}
      {open && <div className="fixed inset-0 z-10" onClick={handleClose}></div>}

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative z-20 flex items-center justify-between w-full bg-white border-2 border-black rounded-xl px-4 py-3 text-xs font-bold text-black shadow-[2px_2px_0_0_#000] transition-transform active:scale-95"
      >
        <span>
          {selected
            ? (selected.icon ? `${selected.icon} ${selected.label}` : selected.label)
            : defaultText}
        </span>
        <FiChevronDown className={`w-4 h-4 text-black font-bold transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute bottom-[calc(100%+8px)] left-0 right-0 z-[80] flex flex-col bg-white border-2 border-black rounded-xl shadow-[4px_4px_0_0_#000] overflow-hidden max-h-56 animate-in zoom-in-95 duration-150 origin-bottom">
          {options.length > 5 && (
            <div className="p-2 border-b-2 border-black bg-gray-50 shrink-0">
              <input
                type="text"
                placeholder="Cari..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border-2 border-black rounded-lg px-3 py-2 text-xs font-bold text-black outline-none shadow-[2px_2px_0_0_#000] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none transition-all"
                autoFocus
              />
            </div>
          )}
          <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col">
            {filteredOptions.length > 0 ? filteredOptions.map((o: any) => (
              <button
                type="button"
                key={o.id}
                onClick={() => { onChange(o.id); handleClose(); }}
                className={`text-left px-4 py-3 text-xs font-bold transition-colors border-b-2 border-black last:border-b-0 ${value === o.id ? "bg-black text-[#E4F087]" : "text-black hover:bg-gray-100"}`}
              >
                {o.icon && <span className="mr-2">{o.icon}</span>}
                {o.label}
              </button>
            )) : (
              <div className="px-4 py-6 text-center text-xs font-bold text-gray-500">Tidak ada hasil</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function TambahTransaksi() {
  const router = useRouter();

  const [jenisTransaksi, setJenisTransaksi] = useState<boolean>(false); // false = pengeluaran, true = pemasukan
  const [tipeTransaksi, setTipeTransaksi] = useState("Kebutuhan");
  const [goals, setGoals] = useState("");
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
    router.push("/transaksi");
  };

  return (
    <div className="min-h-full bg-[#FDF8EE] flex flex-col relative font-sans text-black">
      {/* Header Sticky Neo-Brutalist */}
      <div className="bg-[#DBCBFF] px-5 pt-8 pb-6 flex items-center justify-between border-b-4 border-black shadow-[0_4px_0_0_#000] sticky top-0 z-20">
        <Link href="/transaksi" className="w-10 h-10 flex items-center justify-center bg-white border-2 border-black rounded-full shadow-[2px_2px_0_0_#000] transition-transform active:scale-95">
          <FiArrowLeft className="w-5 h-5 font-black text-black" />
        </Link>
        <h1 className="text-xl font-black text-black">Tambah Transaksi</h1>
        <div className="w-10"></div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">

        {/* Toggle Pemasukan / Pengeluaran */}
        <div className="p-5">
          <div className="gap-2 flex bg-white border-2 border-black p-1.5 rounded-2xl shadow-[4px_4px_0_0_#000]">
            <button
              type="button"
              onClick={() => setJenisTransaksi(false)}
              className={`flex-1 py-3 text-xs font-black rounded-xl transition-all border-2 ${!jenisTransaksi ? "bg-[#FF7676] border-black text-black shadow-[2px_2px_0_0_#000]" : "border-transparent text-gray-500 hover:bg-gray-100"}`}
            >
              PENGELUARAN
            </button>
            <button
              type="button"
              onClick={() => setJenisTransaksi(true)}
              className={`flex-1 py-3 text-xs font-black rounded-xl transition-all border-2 ${jenisTransaksi ? "bg-[#60D689] border-black text-black shadow-[2px_2px_0_0_#000]" : "border-transparent text-gray-500 hover:bg-gray-100"}`}
            >
              PEMASUKAN
            </button>
          </div>
        </div>

        {/* Area Input Nominal (Besar) */}
        <div className="px-5 mb-2 flex flex-col items-center">
          <p className="text-[10px] font-bold mb-2 uppercase tracking-wider text-black">
            Masukkan Nominal
          </p>
          <div className="flex items-center justify-center w-full bg-white border-4 border-black rounded-[32px] py-6 px-4 shadow-[8px_8px_0_0_#000]">
            <span className="text-3xl font-black mr-2">Rp</span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={nominal}
              onChange={handleNominalChange}
              className="bg-transparent border-none outline-none text-4xl font-black text-black w-full text-left placeholder-gray-300"
              required
            />
          </div>
        </div>

        {/* Form Details Area */}
        <div className="px-5 py-8 flex flex-col gap-6 mt-4">

          {/* Input Keterangan Transaksi */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-black uppercase tracking-wider ml-1 flex items-center gap-1">
              <FiEdit2 className="w-3 h-3" /> Keterangan
            </label>
            <input
              type="text"
              placeholder="Makan siang, bensin, dll..."
              value={judul}
              onChange={e => setJudul(e.target.value)}
              className="w-full bg-white border-2 border-black rounded-xl px-4 py-3.5 text-sm font-bold text-black shadow-[2px_2px_0_0_#000] outline-none placeholder-gray-400"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Input Tanggal */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-black uppercase tracking-wider ml-1 flex items-center gap-1">
                <FiCalendar className="w-3 h-3" /> Tanggal
              </label>
              <input
                type="date"
                value={tanggal}
                onChange={e => setTanggal(e.target.value)}
                className="w-full bg-white border-2 border-black rounded-xl px-4 py-3.5 text-xs font-bold text-black shadow-[2px_2px_0_0_#000] outline-none"
                required
              />
            </div>
            {/* Input Waktu */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-black uppercase tracking-wider ml-1 flex items-center gap-1">
                <FiClock className="w-3 h-3" /> Waktu
              </label>
              <input
                type="time"
                value={waktu}
                onChange={e => setWaktu(e.target.value)}
                className="w-full bg-white border-2 border-black rounded-xl px-4 py-3.5 text-xs font-bold text-black shadow-[2px_2px_0_0_#000] outline-none"
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

          <CustomSelect
            label="Jenis Transaksi"
            icon={FiTag}
            value={tipeTransaksi}
            onChange={setTipeTransaksi}
            options={JENIS_TRANSAKSI}
            defaultText="Pilih Jenis Transaksi"
          />

          {/* Jika jenis transaksi yang dipilih goals, maka akan muncul option untuk memilih goals yang sudah ditambahkan */}
          {tipeTransaksi === "Goals" && (
            <CustomSelect
              label="Goals"
              icon={FiTag}
              value={goals}
              onChange={setGoals}
              options={GOALS_LIST}
              defaultText="Pilih Goals"
            />
          )}

          {/* Pemilihan Mood */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-black uppercase tracking-wider ml-1 flex items-center gap-1 mb-1">
              <FiSmile className="w-3 h-3" /> Bagaimana perasaanmu?
            </label>
            <div className="flex gap-2">
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
                    className={`flex-1 py-3 flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-black transition-all active:scale-95 shadow-[2px_2px_0_0_#000] ${mood === m
                      ? 'bg-black text-[#E4F087]'
                      : 'bg-white text-black hover:bg-gray-100'
                      }`}
                  >
                    <span className="text-2xl leading-none drop-shadow-sm mb-1">{getEmoji(m)}</span>
                    <span className={`text-[9px] font-black uppercase tracking-wide ${mood === m ? 'text-[#E4F087]' : 'text-black'}`}>{m}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tombol Simpan */}
          <button
            type="submit"
            disabled={!nominal || !judul}
            className="w-full mt-6 py-4 bg-[#E4F087] text-black border-4 border-black font-black text-sm uppercase rounded-2xl shadow-[4px_4px_0_0_#000] hover:bg-[#d4e076] transition-transform active:translate-y-[4px] active:translate-x-[4px] active:shadow-none disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed disabled:active:translate-y-0 disabled:active:translate-x-0"
          >
            Simpan Transaksi
          </button>

        </div>
      </form>
    </div>
  );
}
