"use client";

import { useState, useEffect } from "react";
import { FiArrowLeft, FiTarget, FiCalendar, FiMessageCircle, FiDroplet, FiSmile, FiEdit2 } from "react-icons/fi";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { getGoalById } from "@/lib/goals-data";
import { updateGoalAction, deleteGoalAction } from "@/lib/goals-action";

const COLORS = ["#DBCBFF", "#E4F087", "#60D689", "#FF7676", "#FFB443", "#87CEFA"];
const EMOJIS = ["📱", "💻", "🏠", "✈️", "🚗", "🎓", "💍", "💰", "🎮", "🎸"];

export default function EditGoals() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [nominal, setNominal] = useState("");
  const [nama, setNama] = useState("");
  const [tenggatWaktu, setTenggatWaktu] = useState(new Date().toISOString().split("T")[0]);
  const [motivasi, setMotivasi] = useState("");
  const [warna, setWarna] = useState(COLORS[0]);
  const [icon, setIcon] = useState(EMOJIS[0]);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      getGoalById(id).then((data) => {
        if (data) {
          setNominal(data.target.toLocaleString('id-ID').replace(/,/g, '.'));
          setNama(data.nama);
          setTenggatWaktu(data.tenggatWaktu);
          setWarna(data.warnaBackground);
          setIcon(data.icon);
          setMotivasi(data.motivasi);
        } else {
          setError("Goal tidak ditemukan atau Anda tidak memiliki akses.");
        }
      }).catch(err => {
        console.error("Error loading goal:", err);
        setError("Gagal memuat data goal.");
      });
    }
  }, [id]);

  const handleNominalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    if (val) {
      setNominal(parseInt(val, 10).toLocaleString('id-ID').replace(/,/g, '.'));
    } else {
      setNominal("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("id", id);
    formData.append("target", nominal);
    formData.append("nama", nama);
    formData.append("tenggatWaktu", tenggatWaktu);
    formData.append("motivasi", motivasi);
    formData.append("warnaBackground", warna);
    formData.append("icon", icon);

    try {
      const res = await updateGoalAction(null, formData);
      if (res.success) {
        router.push("/goals");
      } else {
        setError(res.message);
      }
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan koneksi saat memperbarui.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await deleteGoalAction(id);
      if (res.success) {
        router.push("/goals");
      } else {
        setError(res.message);
      }
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan koneksi saat menghapus.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-full bg-[#FDF8EE] flex flex-col relative font-sans text-black">
      {/* Header Sticky Neo-Brutalist */}
      <div className={`px-5 pt-8 pb-6 flex items-center justify-between border-b-4 border-black shadow-[0_4px_0_0_#000] sticky top-0 z-20 transition-colors duration-300`} style={{ backgroundColor: warna }}>
        <Link href="/goals" className="w-10 h-10 flex items-center justify-center bg-white border-2 border-black rounded-full shadow-[2px_2px_0_0_#000] transition-transform active:scale-95">
          <FiArrowLeft className="w-5 h-5 font-black text-black" />
        </Link>
        <h1 className="text-xl font-black text-black uppercase">Edit Goals</h1>
        <div className="w-10"></div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col pb-10">

        {/* Area Input Nominal (Besar) */}
        <div className="px-5 mb-2 flex flex-col items-center mt-6">
          <p className="text-[10px] font-bold mb-2 uppercase tracking-wider text-black">
            Target Nominal Tabungan
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
        <div className="px-5 py-8 flex flex-col gap-6 mt-2">

          {/* Input Nama Goal & Icon */}
          <div className="flex gap-4">
            {/* Pemilih Icon Emoji */}
            <div className="flex flex-col gap-1.5 relative shrink-0">
              <label className="text-[10px] font-bold text-black uppercase tracking-wider ml-1 flex items-center gap-1">
                <FiSmile className="w-3 h-3" /> Ikon
              </label>
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="w-14 h-[52px] bg-white border-2 border-black rounded-xl shadow-[2px_2px_0_0_#000] flex items-center justify-center text-2xl active:scale-95 transition-transform"
              >
                {icon}
              </button>

              {/* Simple Emoji Picker Dropdown */}
              {showEmojiPicker && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowEmojiPicker(false)}></div>
                  <div className="absolute top-full left-0 mt-2 z-50 bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0_0_#000] p-3 grid grid-cols-5 gap-2 w-[220px]">
                    {EMOJIS.map(e => (
                      <button
                        key={e}
                        type="button"
                        onClick={() => { setIcon(e); setShowEmojiPicker(false); }}
                        className="text-2xl hover:bg-gray-100 rounded-lg p-1 transition-colors"
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Nama Goal */}
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-[10px] font-bold text-black uppercase tracking-wider ml-1 flex items-center gap-1">
                <FiTarget className="w-3 h-3" /> Nama Goal
              </label>
              <input
                type="text"
                placeholder="Cth: Liburan ke Jepang"
                value={nama}
                onChange={e => setNama(e.target.value)}
                className="w-full bg-white border-2 border-black rounded-xl px-4 py-3.5 text-sm font-bold text-black shadow-[2px_2px_0_0_#000] outline-none placeholder-gray-400"
                required
              />
            </div>
          </div>

          {/* Input Tenggat Waktu */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-black uppercase tracking-wider ml-1 flex items-center gap-1">
              <FiCalendar className="w-3 h-3" /> Tenggat Waktu
            </label>
            <input
              type="date"
              value={tenggatWaktu}
              onChange={e => setTenggatWaktu(e.target.value)}
              className="w-full bg-white border-2 border-black rounded-xl px-4 py-3.5 text-sm font-bold text-black shadow-[2px_2px_0_0_#000] outline-none"
              required
            />
          </div>

          {/* Input Motivasi */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-black uppercase tracking-wider ml-1 flex items-center gap-1">
              <FiMessageCircle className="w-3 h-3" /> Kalimat Motivasi
            </label>
            <textarea
              placeholder="Biar semangat nabungnya! (Misal: Ayo nabung, bentar lagi kebeli!)"
              value={motivasi}
              onChange={e => setMotivasi(e.target.value)}
              className="w-full bg-white border-2 border-black rounded-xl px-4 py-3.5 text-sm font-bold text-black shadow-[2px_2px_0_0_#000] outline-none placeholder-gray-400 min-h-[80px] resize-none"
              required
            />
          </div>

          {/* Pilihan Warna */}
          <div className="flex flex-col gap-1.5 mt-2">
            <label className="text-[10px] font-bold text-black uppercase tracking-wider ml-1 flex items-center gap-1">
              <FiDroplet className="w-3 h-3" /> Warna Tema
            </label>
            <div className="flex flex-wrap gap-4 mt-1 pl-1">
              {COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setWarna(c)}
                  className={`w-10 h-10 rounded-full border-2 border-black active:scale-95 transition-transform relative ${warna === c ? 'shadow-none translate-y-1 translate-x-1 ring-2 ring-black ring-offset-2' : 'shadow-[2px_2px_0_0_#000]'}`}
                  style={{ backgroundColor: c }}
                  aria-label={`Pilih warna ${c}`}
                />
              ))}
            </div>
          </div>

        </div>

        {error && (
          <div className="px-5 mt-2">
            <div className="bg-[#FF7676] text-black border-2 border-black rounded-xl p-3.5 text-xs font-black shadow-[2px_2px_0_0_#000]">
              ⚠️ {error}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="px-5 mt-4 flex flex-col gap-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-[#E4F087] border-4 border-black rounded-2xl py-4 text-sm font-black uppercase shadow-[4px_4px_0_0_#000] hover:bg-gray-800 active:translate-y-1 active:translate-x-1 active:shadow-none transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
          >
            <FiEdit2 className="w-5 h-5" /> {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="w-full bg-[#FF7676] text-black border-4 border-black rounded-2xl py-3 text-sm font-black uppercase shadow-[4px_4px_0_0_#000] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
          >
            Hapus Goal
          </button>
        </div>

      </form>
    </div>
  );
}
