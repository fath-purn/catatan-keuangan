"use client";

import { useState, useEffect } from "react";
import { FiX, FiClock, FiTag, FiCreditCard, FiSmile, FiEdit2, FiTrash2, FiChevronDown, FiCalendar } from "react-icons/fi";
import { updateTransactionAction, deleteTransactionAction } from "@/lib/action";
import { getUserGoals } from "@/lib/data";

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

const KEPERLUAN_OPTIONS = [
  { id: "Goals", icon: "🎯", label: "Goals" },
  { id: "Impulsif", icon: "🛍️", label: "Impulsif" },
  { id: "Kebutuhan", icon: "🛒", label: "Kebutuhan" },
  { id: "Emergency", icon: "🆘", label: "Emergency" },
];

function CustomSelect({ label, icon: Icon, value, onChange, options, defaultText }: any) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o: any) => o.id === value || o.label === value);

  return (
    <div className="flex flex-col gap-1.5 relative">
      <label className="text-[10px] font-bold text-black uppercase tracking-wider ml-1 flex items-center gap-1">
        <Icon className="w-3 h-3" /> {label}
      </label>
      {open && <div className="fixed inset-0 z-[60]" onClick={() => setOpen(false)}></div>}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative z-[70] flex items-center justify-between w-full bg-white border-2 border-black rounded-xl px-4 py-3 text-xs font-bold text-black shadow-[2px_2px_0_0_#000] transition-transform active:scale-95"
      >
        <span>{selected ? (selected.icon ? `${selected.icon} ${selected.label}` : selected.label) : defaultText}</span>
        <FiChevronDown className={`w-4 h-4 text-black font-bold transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute bottom-[calc(100%+8px)] left-0 right-0 z-[80] flex flex-col bg-white border-2 border-black rounded-xl shadow-[4px_4px_0_0_#000] overflow-hidden max-h-48 overflow-y-auto animate-in zoom-in-95 duration-150 origin-bottom">
          {options.map((o: any) => (
            <button
              type="button"
              key={o.id}
              onClick={() => { onChange(o.id); setOpen(false); }}
              className={`text-left px-4 py-3 text-xs font-bold transition-colors border-b-2 border-black last:border-0 ${value === o.id || value === o.label ? "bg-black text-[#E4F087]" : "text-black hover:bg-gray-100"}`}
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
  const [availableGoals, setAvailableGoals] = useState<any[]>([]);
  const [isPending, setIsPending] = useState(false);

  const [jenis, setJenis] = useState("");
  const [nominal, setNominal] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [waktu, setWaktu] = useState("");
  const [kategori, setKategori] = useState("");
  const [aset, setAset] = useState("");
  const [mood, setMood] = useState("");
  const [keperluan, setKeperluan] = useState("");
  const [jenisTrx, setJenisTrx] = useState(false); // true = pemasukan
  const [goalId, setGoalId] = useState("");

  // Load goals
  useEffect(() => {
    async function loadGoals() {
      try {
        const goals = await getUserGoals();
        setAvailableGoals(goals);
      } catch (err) {
        console.error("Gagal mengambil goals:", err);
      }
    }
    if (isOpen) {
      loadGoals();
    }
  }, [isOpen]);

  // Sync state dengan transaction prop yang terpilih
  useEffect(() => {
    if (transaction) {
      setJenis(transaction.jenis || "");
      setNominal(transaction.nominal || "");
      setTanggal(transaction.tanggalRaw || "");
      setWaktu(transaction.waktu || "");
      setKategori(transaction.kategori || "");
      setAset(transaction.aset || "");
      setMood(transaction.mood || "Biasa");
      setKeperluan(transaction.keperluan || "Kebutuhan");
      setJenisTrx(transaction.jenis_transaksi || false);
      setGoalId(transaction.goalId || "");
    }
  }, [transaction]);

  if (!isOpen || !transaction) return null;

  // Cek apakah ada data yang diedit
  const isChanged =
    jenis !== transaction.jenis ||
    nominal !== transaction.nominal ||
    tanggal !== transaction.tanggalRaw ||
    waktu !== transaction.waktu ||
    kategori !== transaction.kategori ||
    aset !== transaction.aset ||
    mood !== transaction.mood ||
    keperluan !== transaction.keperluan ||
    jenisTrx !== transaction.jenis_transaksi ||
    goalId !== (transaction.goalId || "");

  const handleNominalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    if (val) setNominal(parseInt(val, 10).toLocaleString('id-ID').replace(/,/g, '.'));
    else setNominal("");
  };

  const handleSave = async () => {
    setIsPending(true);
    try {
      const formData = new FormData();
      formData.append("id", transaction.id);
      formData.append("jenis_transaksi", String(jenisTrx));
      formData.append("nominal", nominal);
      formData.append("judul", jenis);
      formData.append("kategori", kategori);
      formData.append("aset", aset);
      formData.append("keperluan", keperluan);
      formData.append("tanggal", tanggal);
      formData.append("waktu", waktu);
      formData.append("mood", mood);
      if (keperluan === "Goals" && goalId) {
        formData.append("goalId", goalId);
      }

      const res = await updateTransactionAction(null, formData);
      if (res.success) {
        onClose();
      }
    } catch (err) {
      console.error("Error updating transaction:", err);
    } finally {
      setIsPending(false);
    }
  };

  const handleDelete = async () => {
    setIsPending(true);
    try {
      await deleteTransactionAction(transaction.id);
      onClose();
    } catch (err) {
      console.error("Error deleting transaction:", err);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end font-sans sm:max-w-[400px] sm:mx-auto sm:h-[90vh] sm:my-auto sm:rounded-[40px] overflow-hidden">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative z-10 bg-[#FDF8EE] w-full rounded-t-[32px] border-t-4 border-black shadow-[0_-4px_0_0_rgba(0,0,0,1)] p-6 pb-8 flex flex-col gap-6 animate-in slide-in-from-bottom-10 duration-200 max-h-[90vh] overflow-hidden">

        {/* Handle bar & Header */}
        <div className="shrink-0 flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-black text-xl uppercase">Detail Transaksi</h3>
            <button onClick={onClose} disabled={isPending} className="p-2 bg-[#FF7676] border-2 border-black rounded-full shadow-[2px_2px_0_0_#000] active:scale-95 transition-transform disabled:opacity-50">
              <FiX className="w-5 h-5 text-black font-bold" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-6 pb-20 px-1">
          {/* Toggle Pemasukan / Pengeluaran */}
          <div className="flex bg-white gap-2 border-2 border-black p-1.5 rounded-2xl shadow-[4px_4px_0_0_#000] shrink-0">
            <button type="button" disabled={isPending} onClick={() => setJenisTrx(false)} className={`flex-1 py-3 text-xs font-black rounded-xl transition-all border-2 ${!jenisTrx ? "bg-[#FF7676] border-black text-black shadow-[2px_2px_0_0_#000]" : "border-transparent text-gray-500 hover:bg-gray-100"}`}>PENGELUARAN</button>
            <button type="button" disabled={isPending} onClick={() => setJenisTrx(true)} className={`flex-1 py-3 text-xs font-black rounded-xl transition-all border-2 ${jenisTrx ? "bg-[#60D689] border-black text-black shadow-[2px_2px_0_0_#000]" : "border-transparent text-gray-500 hover:bg-gray-100"}`}>PEMASUKAN</button>
          </div>

          {/* Nominal */}
          <div className="flex flex-col items-center">
            <p className="text-[10px] font-bold mb-2 uppercase tracking-wider text-black">Nominal</p>
            <div className="flex items-center justify-center w-full bg-white border-4 border-black rounded-[32px] py-6 px-4 shadow-[8px_8px_0_0_#000]">
              <span className="text-3xl font-black mr-2 text-black">Rp</span>
              <input type="text" disabled={isPending} inputMode="numeric" value={nominal} onChange={handleNominalChange} className="bg-transparent border-none outline-none text-4xl font-black text-black w-full text-center p-0 disabled:opacity-50" />
            </div>
          </div>

          {/* Keterangan */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-black uppercase tracking-wider ml-1 flex items-center gap-1">
              <FiEdit2 className="w-3 h-3" /> Keterangan
            </label>
            <input type="text" disabled={isPending} value={jenis} onChange={e => setJenis(e.target.value)} className="w-full bg-white border-2 border-black rounded-xl px-4 py-3.5 text-sm font-bold text-black shadow-[2px_2px_0_0_#000] outline-none disabled:opacity-50" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <CustomSelect label="Kategori" icon={FiTag} value={kategori} onChange={setKategori} options={KATEGORI_LIST} defaultText="Pilih" />
            <CustomSelect label="Aset" icon={FiCreditCard} value={aset} onChange={setAset} options={ASET_LIST} defaultText="Pilih" />
          </div>

          <CustomSelect
            label="Keperluan"
            icon={FiTag}
            value={keperluan}
            onChange={setKeperluan}
            options={KEPERLUAN_OPTIONS}
            defaultText="Pilih Jenis Transaksi"
          />

          {keperluan === "Goals" && (
            <CustomSelect
              label="Goals"
              icon={FiTag}
              value={goalId}
              onChange={setGoalId}
              options={availableGoals}
              defaultText="Pilih Goals"
            />
          )}

          <div className="grid grid-cols-2 gap-4">
            {/* Tanggal */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-black uppercase tracking-wider ml-1 flex items-center gap-1">
                <FiCalendar className="w-3 h-3" /> Tanggal
              </label>
              <input type="date" disabled={isPending} value={tanggal} onChange={e => setTanggal(e.target.value)} className="w-full bg-white border-2 border-black rounded-xl px-4 py-3.5 text-xs font-bold text-black shadow-[2px_2px_0_0_#000] outline-none disabled:opacity-50" />
            </div>
            {/* Waktu */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-black uppercase tracking-wider ml-1 flex items-center gap-1">
                <FiClock className="w-3 h-3" /> Waktu
              </label>
              <input type="time" disabled={isPending} value={waktu} onChange={e => setWaktu(e.target.value)} className="w-full bg-white border-2 border-black rounded-xl px-4 py-3.5 text-xs font-bold text-black shadow-[2px_2px_0_0_#000] outline-none disabled:opacity-50" />
            </div>
          </div>

          {/* Mood */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-black uppercase tracking-wider ml-1 flex items-center gap-1"><FiSmile className="w-3 h-3" /> Mood</label>
            <div className="relative">
              <select
                disabled={isPending}
                value={mood}
                onChange={e => setMood(e.target.value)}
                className="w-full bg-white border-2 border-black rounded-xl px-4 py-3.5 text-xs font-bold text-black shadow-[2px_2px_0_0_#000] outline-none appearance-none disabled:opacity-50"
              >
                <option value="Senang">😊 Senang</option>
                <option value="Biasa">😐 Biasa</option>
                <option value="Sedih">😢 Sedih</option>
                <option value="Marah">😡 Marah</option>
              </select>
              <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black font-bold pointer-events-none" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 shrink-0">
            <button onClick={handleDelete} disabled={isPending} className="flex items-center justify-center px-5 py-4 bg-[#FF7676] text-black border-4 border-black font-bold rounded-2xl shadow-[4px_4px_0_0_#000] hover:bg-red-400 transition-transform active:translate-y-1 active:translate-x-1 active:shadow-none disabled:opacity-50" title="Hapus">
              <FiTrash2 className="w-6 h-6" />
            </button>
            {isChanged ? (
              <button onClick={handleSave} disabled={isPending} className="flex-1 py-4 bg-[#E4F087] text-black border-4 border-black font-black uppercase text-sm rounded-2xl shadow-[4px_4px_0_0_#000] hover:bg-[#d4e076] transition-transform active:translate-y-1 active:translate-x-1 active:shadow-none disabled:opacity-50">
                {isPending ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            ) : (
              <button onClick={onClose} disabled={isPending} className="flex-1 py-4 bg-white text-black border-4 border-black font-black uppercase text-sm rounded-2xl shadow-[4px_4px_0_0_#000] hover:bg-gray-100 transition-transform active:translate-y-1 active:translate-x-1 active:shadow-none disabled:opacity-50">
                Tutup
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
