"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FiUser, FiEdit3, FiPieChart, FiTrendingUp, FiTrendingDown, FiCalendar, FiSmile, FiSave, FiX } from "react-icons/fi";
import { getProfileData } from "@/lib/profile-data";
import { updateProfileAction } from "@/lib/profile-action";

const ICONS = ["👦🏻", "👧🏻", "👩🏻", "👨🏻", "🐱", "🐶", "🐸", "🐻", "🦊", "🐼", "🐰", "🐯"];

export default function ProfilePage() {
  // State Profile
  const [isEditing, setIsEditing] = useState(false);
  const [nama, setNama] = useState("");
  const [icon, setIcon] = useState("👦🏻");
  const [targetGayaHidup, setTargetGayaHidup] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getProfileData().then((data) => {
      if (data) {
        setNama(data.nama);
        setIcon(data.icon);
        setTargetGayaHidup(data.targetGayaHidup);
      }
    }).catch((err) => {
      console.error("Gagal memuat profile:", err);
      setError("Gagal memuat profile.");
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  const handleTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    if (val) {
      setTargetGayaHidup(parseInt(val, 10).toLocaleString('id-ID').replace(/,/g, '.'));
    } else {
      setTargetGayaHidup("");
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("name", nama);
    formData.append("avatar", icon);
    formData.append("targetGayaHidup", targetGayaHidup);

    try {
      const res = await updateProfileAction(null, formData);
      if (res.success) {
        setIsEditing(false);
        setSuccess("Profile berhasil diperbarui!");
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(res.message);
      }
    } catch (err) {
      console.error("Gagal menyimpan profile:", err);
      setError("Terjadi kesalahan koneksi saat menyimpan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-[#FDF8EE] flex flex-col relative font-sans text-black pb-24">
      {/* Header Sticky Neo-Brutalist */}
      <div className="bg-[#87CEFA] px-5 pt-8 pb-6 flex items-center justify-between border-b-4 border-black shadow-[0_4px_0_0_#000] sticky top-0 z-20">
        <div className="w-10"></div>
        <h1 className="text-xl font-black text-black uppercase flex items-center gap-2">
          <FiUser className="w-6 h-6" /> Profile
        </h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          disabled={loading}
          className="w-10 h-10 flex items-center justify-center bg-white border-2 border-black rounded-full shadow-[2px_2px_0_0_#000] transition-transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
        >
          {isEditing ? <FiX className="w-5 h-5 font-black text-black" /> : <FiEdit3 className="w-5 h-5 font-black text-black" />}
        </button>
      </div>

      <div className="px-5 py-6 flex flex-col gap-8 mt-2">

        {/* Section Edit & Info Profile */}
        <div className="bg-white border-4 border-black rounded-3xl p-6 shadow-[8px_8px_0_0_#000] relative">
          
          {error && (
            <div className="bg-[#FF7676] text-black border-2 border-black rounded-xl p-3.5 text-xs font-black shadow-[2px_2px_0_0_#000] mb-4 text-center">
              ⚠️ {error}
            </div>
          )}
          {success && (
            <div className="bg-[#60D689] text-black border-2 border-black rounded-xl p-3.5 text-xs font-black shadow-[2px_2px_0_0_#000] mb-4 text-center">
              🎉 {success}
            </div>
          )}

          {!isEditing ? (
            /* View Mode */
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-[#DBCBFF] border-4 border-black rounded-full shadow-[4px_4px_0_0_#000] flex items-center justify-center text-5xl mb-4">
                {icon}
              </div>
              <h2 className="text-2xl font-black uppercase tracking-wide mb-1">{nama || "Loading..."}</h2>
              <div className="inline-block bg-[#E4F087] border-2 border-black px-4 py-2 rounded-xl shadow-[2px_2px_0_0_#000] mt-2">
                <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5">Target Gaya Hidup</p>
                <p className="text-sm font-black">Rp {targetGayaHidup || "0"} / bln</p>
              </div>
            </div>
          ) : (
            /* Edit Mode */
            <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-top-2 duration-200">
              <h2 className="text-lg font-black uppercase text-center border-b-2 border-black pb-2">Edit Profile</h2>

              {/* Pilih Icon */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <FiSmile className="w-3 h-3" /> Pilih Avatar Lucu
                </label>
                <div className="flex gap-3 overflow-x-auto pb-4 pt-1 px-1 no-scrollbar">
                  {ICONS.map((i) => (
                    <button
                      key={i}
                      disabled={loading}
                      onClick={() => setIcon(i)}
                      className={`w-12 h-12 shrink-0 border-2 border-black rounded-full text-2xl flex items-center justify-center transition-transform active:scale-95 ${icon === i ? 'bg-[#FF7676] shadow-none translate-y-1 translate-x-1 ring-2 ring-black ring-offset-2' : 'bg-gray-100 shadow-[2px_2px_0_0_#000]'} disabled:opacity-50`}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </div>

              {/* Edit Nama */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <FiUser className="w-3 h-3" /> Nama Panggilan
                </label>
                <input
                  type="text"
                  value={nama}
                  disabled={loading}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-black rounded-xl px-4 py-3 text-sm font-bold shadow-[2px_2px_0_0_#000] outline-none focus:bg-white disabled:opacity-50"
                  required
                />
              </div>

              {/* Edit Target Gaya Hidup */}
              <div className="flex flex-col gap-1.5 mb-2">
                <label className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <FiPieChart className="w-3 h-3" /> Target Gaya Hidup (Bulanan)
                </label>
                <div className="flex items-center w-full bg-gray-50 border-2 border-black rounded-xl px-4 py-3 shadow-[2px_2px_0_0_#000] focus-within:bg-white">
                  <span className="font-black mr-2">Rp</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={targetGayaHidup}
                    disabled={loading}
                    onChange={handleTargetChange}
                    className="w-full bg-transparent border-none outline-none text-sm font-bold disabled:opacity-50"
                    required
                  />
                </div>
                <p className="text-[9px] font-bold text-gray-500 italic mt-1">Batas maksimal pengeluaranmu per bulan.</p>
              </div>

              <button
                onClick={handleSave}
                disabled={loading}
                className="w-full bg-black text-[#E4F087] border-4 border-black rounded-2xl py-3.5 text-sm font-black uppercase shadow-[4px_4px_0_0_#000] hover:bg-gray-800 active:translate-y-1 active:translate-x-1 active:shadow-none transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
              >
                <FiSave className="w-4 h-4" /> {loading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          )}
        </div>

        {/* Section Laporan & Grafik */}
        <div className="flex flex-col gap-4 mt-2">
          <h2 className="text-xl font-black uppercase tracking-wider drop-shadow-[2px_2px_0_#FF7676]">Analisis Keuangan</h2>

          <div className="grid grid-cols-2 gap-4">

            {/* Grafik Mingguan */}
            <Link href="/laporan/mingguan" className="bg-[#DBCBFF] border-4 border-black rounded-3xl p-4 shadow-[4px_4px_0_0_#000] flex flex-col items-start transition-transform active:scale-95 text-left h-36 relative overflow-hidden group">
              <div className="w-8 h-8 bg-white border-2 border-black rounded-lg shadow-[2px_2px_0_0_#000] flex items-center justify-center mb-2 z-10">
                <FiCalendar className="w-4 h-4" />
              </div>
              <h3 className="font-black text-sm uppercase z-10 leading-tight">Grafik<br />Mingguan</h3>
              {/* Mini CSS Bar Chart Illustration */}
              <div className="absolute bottom-0 right-4 flex items-end gap-1 opacity-60">
                <div className="w-3 bg-black rounded-t-sm h-4"></div>
                <div className="w-3 bg-black rounded-t-sm h-8"></div>
                <div className="w-3 bg-black rounded-t-sm h-6"></div>
                <div className="w-3 bg-black rounded-t-sm h-10"></div>
                <div className="w-3 bg-black rounded-t-sm h-5"></div>
              </div>
            </Link>

            {/* Grafik Bulanan */}
            <Link href="/laporan/bulanan" className="bg-[#FFB443] border-4 border-black rounded-3xl p-4 shadow-[4px_4px_0_0_#000] flex flex-col items-start transition-transform active:scale-95 text-left h-36 relative overflow-hidden group">
              <div className="w-8 h-8 bg-white border-2 border-black rounded-lg shadow-[2px_2px_0_0_#000] flex items-center justify-center mb-2 z-10">
                <FiPieChart className="w-4 h-4" />
              </div>
              <h3 className="font-black text-sm uppercase z-10 leading-tight">Grafik<br />Bulanan</h3>
              {/* Mini CSS Area Chart Illustration */}
              <div className="absolute -bottom-2 -right-2 opacity-40">
                <svg width="80" height="40" viewBox="0 0 80 40">
                  <path d="M0 40 L0 30 L20 20 L40 25 L60 10 L80 15 L80 40 Z" fill="black" />
                </svg>
              </div>
            </Link>

            {/* Grafik Pemasukan */}
            <Link href="/laporan/pemasukan" className="bg-[#60D689] border-4 border-black rounded-3xl p-4 shadow-[4px_4px_0_0_#000] flex flex-col items-start transition-transform active:scale-95 text-left h-36 relative overflow-hidden group">
              <div className="w-8 h-8 bg-white border-2 border-black rounded-lg shadow-[2px_2px_0_0_#000] flex items-center justify-center mb-2 z-10">
                <FiTrendingUp className="w-4 h-4" />
              </div>
              <h3 className="font-black text-sm uppercase z-10 leading-tight">Pemasukan</h3>
              <p className="text-[9px] font-bold bg-white/50 px-1.5 py-0.5 rounded border border-black z-10 mt-1">Uang Masuk</p>
              <div className="absolute -bottom-2 -right-2 text-6xl opacity-20 transform -rotate-12">
                📈
              </div>
            </Link>

            {/* Grafik Pengeluaran */}
            <Link href="/laporan/pengeluaran" className="bg-[#FF7676] border-4 border-black rounded-3xl p-4 shadow-[4px_4px_0_0_#000] flex flex-col items-start transition-transform active:scale-95 text-left h-36 relative overflow-hidden group">
              <div className="w-8 h-8 bg-white border-2 border-black rounded-lg shadow-[2px_2px_0_0_#000] flex items-center justify-center mb-2 z-10">
                <FiTrendingDown className="w-4 h-4" />
              </div>
              <h3 className="font-black text-sm uppercase z-10 leading-tight">Pengeluaran</h3>
              <p className="text-[9px] font-bold bg-white/50 px-1.5 py-0.5 rounded border border-black z-10 mt-1">Uang Keluar</p>
              <div className="absolute -bottom-2 -right-2 text-6xl opacity-20 transform rotate-12">
                📉
              </div>
            </Link>

          </div>
        </div>

      </div>
    </div>
  );
}
