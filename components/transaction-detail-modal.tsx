"use client";

import { useState } from "react";
import { FiX, FiClock, FiTag, FiCreditCard, FiSmile, FiEdit2, FiTrash2, FiChevronDown } from "react-icons/fi";

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

function CustomSelect({ label, icon: Icon, value, onChange, options, defaultText }: any) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o: any) => o.label === value || o.id === value);

  return (
    <div className="flex flex-col gap-1.5 relative">
      <label className="text-xs font-bold text-gray-500 flex items-center gap-1.5 ml-1">
        <Icon className="w-4 h-4" /> {label}
      </label>
      {open && <div className="fixed inset-0 z-[60]" onClick={() => setOpen(false)}></div>}
      <button 
        type="button"
        onClick={() => setOpen(!open)}
        className={`relative z-[70] flex items-center justify-between w-full bg-gray-50 border rounded-2xl px-4 py-3.5 text-sm font-semibold text-gray-800 transition-all ${
          open ? "border-red-500 ring-2 ring-red-500/20 bg-white" : "border-gray-200 hover:bg-gray-100"
        }`}
      >
        <span>{selected ? (selected.icon ? `${selected.icon} ${selected.label}` : selected.label) : defaultText}</span>
        <FiChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${open ? "rotate-180 text-red-500" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-[76px] left-0 right-0 z-[80] flex flex-col bg-white border border-gray-100 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] overflow-hidden max-h-48 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
          {options.map((o: any) => (
             <button
               type="button"
               key={o.id}
               onClick={() => { onChange(o.label); setOpen(false); }}
               className={`text-left px-4 py-3.5 text-sm transition-colors border-b border-gray-50 last:border-0 ${
                 value === o.label ? "bg-red-50 text-red-700 font-bold" : "text-gray-700 hover:bg-gray-50"
               }`}
             >
               {o.icon && <span className="mr-2">{o.icon}</span>} {o.label}
             </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TransactionDetailModal({ isOpen, onClose, transaction }: any) {
  if (!isOpen || !transaction) return null;

  const [jenis, setJenis] = useState(transaction.jenis);
  const [nominal, setNominal] = useState(transaction.nominal);
  const [waktu, setWaktu] = useState(transaction.waktu);
  const [kategori, setKategori] = useState(transaction.kategori);
  const [aset, setAset] = useState(transaction.aset);
  const [mood, setMood] = useState(transaction.mood);
  const [jenisTrx, setJenisTrx] = useState(transaction.jenis_transaksi); // true = pemasukan

  // Cek apakah ada data yang diedit
  const isChanged = 
    jenis !== transaction.jenis ||
    nominal !== transaction.nominal ||
    waktu !== transaction.waktu ||
    kategori !== transaction.kategori ||
    aset !== transaction.aset ||
    mood !== transaction.mood ||
    jenisTrx !== transaction.jenis_transaksi;

  const handleNominalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    if (val) setNominal(parseInt(val, 10).toLocaleString('id-ID').replace(/,/g, '.'));
    else setNominal("");
  };

  return (
    <div className="absolute inset-0 z-[100] flex flex-col justify-end">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative z-10 bg-white w-full rounded-t-[32px] shadow-[0_-8px_30px_rgba(0,0,0,0.12)] p-6 pb-8 flex flex-col gap-6 animate-in slide-in-from-bottom-10 duration-200 max-h-[90vh] overflow-hidden">
        
        {/* Handle bar & Header */}
        <div className="shrink-0 flex flex-col">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-3"></div>
            <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-800 text-xl">Detail Transaksi</h3>
            <button onClick={onClose} className="p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 rounded-full transition-colors">
                <FiX className="w-6 h-6" />
            </button>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-6 pb-4">
            {/* Toggle Pemasukan / Pengeluaran */}
            <div className="flex bg-gray-100 p-1 rounded-2xl relative shrink-0">
            <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-xl shadow-sm transition-all duration-300 ${jenisTrx ? "translate-x-full left-[4px]" : "translate-x-0 left-[4px]"}`}></div>
            <button type="button" onClick={() => setJenisTrx(false)} className={`relative z-10 flex-1 py-2 text-sm font-bold rounded-xl transition-colors ${!jenisTrx ? "text-red-600" : "text-gray-500"}`}>Pengeluaran</button>
            <button type="button" onClick={() => setJenisTrx(true)} className={`relative z-10 flex-1 py-2 text-sm font-bold rounded-xl transition-colors ${jenisTrx ? "text-green-600" : "text-gray-500"}`}>Pemasukan</button>
            </div>

            {/* Nominal */}
            <div className={`flex flex-col items-center justify-center p-5 rounded-3xl border border-gray-100 transition-colors focus-within:ring-2 focus-within:ring-red-500/20 ${jenisTrx ? 'bg-green-50' : 'bg-red-50'}`}>
                <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${jenisTrx ? 'text-green-600/70' : 'text-red-600/70'}`}>Nominal</p>
                <div className="flex items-center text-4xl font-black text-gray-800">
                <span className="mr-2 text-2xl text-gray-400">Rp</span>
                <input type="text" inputMode="numeric" value={nominal} onChange={handleNominalChange} className="bg-transparent border-none outline-none text-center w-[180px] p-0" />
                </div>
            </div>

            {/* Keterangan */}
            <div className="flex items-center gap-3 border-b border-gray-100 pb-2 focus-within:border-gray-300 transition-colors">
                <div className="p-3 bg-gray-50 rounded-xl text-gray-400"><FiEdit2 className="w-5 h-5" /></div>
                <div className="flex-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Keterangan / Catatan</label>
                <input type="text" value={jenis} onChange={e => setJenis(e.target.value)} className="w-full bg-transparent border-none outline-none text-gray-800 font-bold text-base p-0" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <CustomSelect label="Kategori" icon={FiTag} value={kategori} onChange={setKategori} options={KATEGORI_LIST} defaultText="Pilih" />
                <CustomSelect label="Aset" icon={FiCreditCard} value={aset} onChange={setAset} options={ASET_LIST} defaultText="Pilih" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Waktu */}
                <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 flex items-center gap-1.5 ml-1"><FiClock className="w-4 h-4"/> Waktu</label>
                <input type="time" value={waktu} onChange={e => setWaktu(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-red-500/20" />
                </div>
                {/* Mood */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-500 flex items-center gap-1.5 ml-1"><FiSmile className="w-4 h-4" /> Mood</label>
                    <div className="relative">
                        <select
                        value={mood}
                        onChange={e => setMood(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-red-500/20 transition-all appearance-none"
                        >
                            <option value="Senang">😊 Senang</option>
                            <option value="Biasa">😐 Biasa</option>
                            <option value="Sedih">😢 Sedih</option>
                            <option value="Marah">😡 Marah</option>
                        </select>
                        <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>
                </div>
            </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2 border-t border-gray-100 shrink-0">
          <button onClick={() => { alert('Transaksi berhasil dihapus'); onClose(); }} className="flex items-center justify-center gap-2 px-5 py-4 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-100 transition-colors active:scale-95" title="Hapus">
            <FiTrash2 className="w-5 h-5" />
          </button>
          {isChanged ? (
            <button onClick={() => { alert('Perubahan disimpan!'); onClose(); }} className="flex-1 py-4 bg-red-600 text-white font-bold rounded-2xl shadow-lg shadow-red-600/30 hover:bg-red-700 transition-colors active:scale-[0.98]">
              Simpan Perubahan
            </button>
          ) : (
             <button onClick={onClose} className="flex-1 py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-colors active:scale-[0.98]">
               Tutup
             </button>
          )}
        </div>

      </div>
    </div>
  );
}
