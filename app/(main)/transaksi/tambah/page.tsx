"use client";

import { useActionState, useEffect, useState } from "react";
import { createTransactionAction } from "@/lib/action";
import { getUserGoals } from "@/lib/data"; // Ambil daftar goals dari DB
import { FiArrowLeft, FiCalendar, FiClock, FiTag, FiCreditCard, FiSmile, FiEdit2, FiChevronDown } from "react-icons/fi";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GoalTransaction, FormStateTransaction } from "@/types/props";
import clsx from "clsx";
import { useLanguage } from "@/components/language-provider";

// Komponen Select Kustom Neo-Brutalist
function CustomSelect({ label, icon: Icon, value, onChange, options, defaultText }: any) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useLanguage();
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
                placeholder={t("cari_placeholder")}
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
              <div className="px-4 py-6 text-center text-xs font-bold text-gray-500">{t("tidak_ada_hasil")}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function TambahTransaksi() {
  const router = useRouter();
  const { t } = useLanguage();
  const [state, formAction, isPending] = useActionState(createTransactionAction, null);
  const [availableGoals, setAvailableGoals] = useState<GoalTransaction[]>([]);
  const [formErrors, setFormErrors] = useState<FormStateTransaction | null>(null);

  // State untuk form fields
  const [jenisTransaksi, setJenisTransaksi] = useState<boolean>(false); // false = pengeluaran, true = pemasukan
  const [nominal, setNominal] = useState("");
  const [kategori, setKategori] = useState("Makanan");
  const [aset, setAset] = useState("Cash");
  const [tipeTransaksi, setTipeTransaksi] = useState<"Goals" | "Impulsif" | "Kebutuhan" | "Emergency">("Kebutuhan");
  const [goalId, setGoalId] = useState("");
  const [mood, setMood] = useState("Biasa");

  const translatedKategoriList = [
    { id: "Makanan", icon: "🍔", label: t("opt_makanan") },
    { id: "Transportasi", icon: "🚗", label: t("opt_transportasi") },
    { id: "Belanja", icon: "🛍️", label: t("opt_belanja") },
    { id: "Tagihan", icon: "🧾", label: t("opt_tagihan") },
    { id: "Pemasukan", icon: "💰", label: t("opt_pemasukan") },
    { id: "Lainnya", icon: "📦", label: t("opt_lainnya") },
  ];

  const translatedAsetList = [
    { id: "Cash", icon: "💵", label: t("opt_semua") === "All" ? "Cash" : "Tunai" },
    { id: "BNI", icon: "🏦", label: "BNI" },
    { id: "BCA", icon: "🏦", label: "BCA" },
    { id: "OVO", icon: "📱", label: "OVO" },
    { id: "Gopay", icon: "📱", label: "Gopay" },
  ];

  const translatedJenisTransaksi = [
    { id: "Goals", icon: "🎯", label: t("opt_goals") },
    { id: "Impulsif", icon: "🛍️", label: t("opt_impulsif") },
    { id: "Kebutuhan", icon: "🛒", label: t("opt_kebutuhan") },
    { id: "Emergency", icon: "🆘", label: t("opt_emergency") },
  ];

  // Load goals saat komponen pertama kali mount
  useEffect(() => {
    async function loadGoals() {
      try {
        const goals = await getUserGoals();
        setAvailableGoals(goals);
        if (goals.length > 0) {
          setGoalId(goals[0].id);
        }
      } catch (error) {
        console.error("Error loading goals:", error);
      }
    }
    loadGoals();
  }, []);

  useEffect(() => {
    if (state?.message && state.success !== false) {
      // Putar suara koin
      const audio = new Audio("/suara-koin.mp3");
      audio.play().catch((err) => console.error("Error playing sound:", err));

      setTimeout(() => {
        router.push("/transaksi");
      }, 500);
    }
    if (state?.error) {
      setFormErrors(state);
    }
  }, [state, router]);

  const handleNominalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    if (val) {
      setNominal(parseInt(val, 10).toLocaleString('id-ID').replace(/,/g, '.'));
    } else {
      setNominal("");
    }
  };

  return (
    <div className="min-h-full bg-[#FDF8EE] flex flex-col relative font-sans text-black">
      {/* Header Sticky Neo-Brutalist */}
      <div className="bg-[#DBCBFF] px-5 pt-8 pb-6 flex items-center justify-between border-b-4 border-black shadow-[0_4px_0_0_#000] sticky top-0 z-20">
        <Link href="/transaksi" className="w-10 h-10 flex items-center justify-center bg-white border-2 border-black rounded-full shadow-[2px_2px_0_0_#000] transition-transform active:scale-95">
          <FiArrowLeft className="w-5 h-5 font-black text-black" />
        </Link>
        <h1 className="text-xl font-black text-black">{t("tambah_transaksi")}</h1>
        <div className="w-10"></div>
      </div>

      <form action={formAction} className="flex-1 flex flex-col">
        {/* Hidden inputs untuk submit data state custom */}
        <input type="hidden" name="jenis_transaksi" value={String(jenisTransaksi)} />
        <input type="hidden" name="kategori" value={kategori} />
        <input type="hidden" name="aset" value={aset} />
        <input type="hidden" name="keperluan" value={tipeTransaksi} />
        <input type="hidden" name="mood" value={mood} />
        {tipeTransaksi === "Goals" && <input type="hidden" name="goalId" value={goalId} />}

        {/* Toggle Pemasukan / Pengeluaran */}
        <div className="p-5">
          <div className="gap-2 flex bg-white border-2 border-black p-1.5 rounded-2xl shadow-[4px_4px_0_0_#000]">
            <button
              type="button"
              onClick={() => setJenisTransaksi(false)}
              className={`flex-1 py-3 text-xs font-black rounded-xl transition-all border-2 ${!jenisTransaksi ? "bg-[#FF7676] border-black text-black shadow-[2px_2px_0_0_#000]" : "border-transparent text-gray-500 hover:bg-gray-100"}`}
            >
              {t("pengeluaran_caps")}
            </button>
            <button
              type="button"
              onClick={() => setJenisTransaksi(true)}
              className={`flex-1 py-3 text-xs font-black rounded-xl transition-all border-2 ${jenisTransaksi ? "bg-[#60D689] border-black text-black shadow-[2px_2px_0_0_#000]" : "border-transparent text-gray-500 hover:bg-gray-100"}`}
            >
              {t("pemasukan_caps")}
            </button>
          </div>
        </div>

        {/* Area Input Nominal (Besar) */}
        <div className="px-5 mb-2 flex flex-col items-center">
          <p className="text-[10px] font-bold mb-2 uppercase tracking-wider text-black">
            {t("masukkan_nominal")}
          </p>
          <div className="flex items-center justify-center w-full bg-white border-4 border-black rounded-[32px] py-6 px-4 shadow-[8px_8px_0_0_#000]">
            <span className="text-3xl font-black mr-2">Rp</span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="0"
              name="nominal"
              value={nominal}
              onChange={handleNominalChange}
              className="bg-transparent border-none outline-none text-4xl font-black text-black w-full text-left placeholder-gray-300"
              required
            />
          </div>
          {formErrors?.error?.nominal && (
            <p className="text-red-500 text-sm ml-1 mt-1 font-bold">{formErrors.error.nominal[0]}</p>
          )}
        </div>

        {/* Form Details Area */}
        <div className="px-5 py-8 flex flex-col gap-6 mt-4">

          {/* Input Keterangan Transaksi */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-black uppercase tracking-wider ml-1 flex items-center gap-1">
              <FiEdit2 className="w-3 h-3" /> {t("keterangan")}
            </label>
            <input
              type="text"
              placeholder={t("placeholder_keterangan")}
              name="judul"
              className="w-full bg-white border-2 border-black rounded-xl px-4 py-3.5 text-sm font-bold text-black shadow-[2px_2px_0_0_#000] outline-none placeholder-gray-400"
              required
            />
          </div>
          {formErrors?.error?.judul && (
            <p className="text-red-500 text-sm ml-1 font-bold">{formErrors.error.judul[0]}</p>
          )}

          <div className="grid grid-cols-2 gap-4">
            {/* Input Tanggal */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-black uppercase tracking-wider ml-1 flex items-center gap-1">
                <FiCalendar className="w-3 h-3" /> {t("tanggal")}
              </label>
              <input
                type="date"
                name="tanggal"
                defaultValue={new Date().toISOString().split("T")[0]}
                className="w-full bg-white border-2 border-black rounded-xl px-4 py-3.5 text-xs font-bold text-black shadow-[2px_2px_0_0_#000] outline-none"
                required
              />
            </div>

            {/* Input Waktu */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-black uppercase tracking-wider ml-1 flex items-center gap-1">
                <FiClock className="w-3 h-3" /> {t("waktu")}
              </label>
              <input
                type="time"
                name="waktu"
                defaultValue={new Date().toTimeString().substring(0, 5)}
                className="w-full bg-white border-2 border-black rounded-xl px-4 py-3.5 text-xs font-bold text-black shadow-[2px_2px_0_0_#000] outline-none"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {formErrors?.error?.tanggal && (
              <p className="text-red-500 text-sm ml-1 font-bold">{formErrors.error.tanggal[0]}</p>
            )}
            {formErrors?.error?.waktu && (
              <p className="text-red-500 text-sm ml-1 font-bold">{formErrors.error.waktu[0]}</p>
            )}
          </div>

          {/* Kategori & Aset Dropdowns */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <CustomSelect
                label={t("kategori")}
                icon={FiTag}
                value={kategori}
                onChange={setKategori}
                options={translatedKategoriList}
                defaultText={t("pilih_kategori")}
              />
              {formErrors?.error?.kategori && (
                <p className="text-red-500 text-sm ml-1 mt-1 font-bold">{formErrors.error.kategori[0]}</p>
              )}
            </div>

            <div>
              <CustomSelect
                label={t("aset")}
                icon={FiCreditCard}
                value={aset}
                onChange={setAset}
                options={translatedAsetList}
                defaultText={t("pilih_aset")}
              />
              {formErrors?.error?.aset && (
                <p className="text-red-500 text-sm ml-1 mt-1 font-bold">{formErrors.error.aset[0]}</p>
              )}
            </div>
          </div>

          <CustomSelect
            label={t("keperluan")}
            icon={FiTag}
            options={translatedJenisTransaksi}
            value={tipeTransaksi}
            onChange={(value: string) => {
              setTipeTransaksi(value as "Goals" | "Impulsif" | "Kebutuhan" | "Emergency");
            }}
            defaultText={t("pilih_jenis_transaksi")}
          />

          {/* Jika jenis transaksi yang dipilih goals, maka akan muncul option untuk memilih goals yang sudah ditambahkan */}
          {tipeTransaksi === "Goals" && (
            <div>
              <CustomSelect
                label={t("opt_goals")}
                icon={FiTag}
                value={goalId}
                onChange={setGoalId}
                options={availableGoals}
                defaultText={t("pilih_goals")}
              />
              {formErrors?.error?.goalId && (
                <p className="text-red-500 text-sm ml-1 mt-1 font-bold">{formErrors.error.goalId[0]}</p>
              )}
            </div>
          )}

          {/* Pemilihan Mood */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-black uppercase tracking-wider ml-1 flex items-center gap-1 mb-1">
              <FiSmile className="w-3 h-3" /> {t("bagaimana_perasaanmu")}
            </label>
            <div className="flex gap-2">
              {["Senang", "Biasa", "Sedih", "Marah"].map((m) => {
                const getEmoji = (moodName: string) => {
                  if (moodName === "Senang") return "😊";
                  if (moodName === "Marah") return "😡";
                  if (moodName === "Sedih") return "😢";
                  return "😐";
                };
                const getTranslatedMoodLabel = (moodName: string) => {
                  if (moodName === "Senang") return t("opt_senang");
                  if (moodName === "Marah") return t("opt_marah");
                  if (moodName === "Sedih") return t("opt_sedih");
                  return t("opt_biasa");
                };
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setMood(m);
                    }}
                    className={`flex-1 py-3 flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-black transition-all active:scale-95 shadow-[2px_2px_0_0_#000] ${mood === m
                      ? 'bg-black text-[#E4F087]'
                      : 'bg-white text-black hover:bg-gray-100'
                      }`}
                  >
                    <span className="text-2xl leading-none drop-shadow-sm mb-1">{getEmoji(m)}</span>
                    <span className={`text-[9px] font-black uppercase tracking-wide ${mood === m ? 'text-[#E4F087]' : 'text-black'}`}>{getTranslatedMoodLabel(m)}</span>
                  </button>
                );
              })}
            </div>
            {formErrors?.error?.mood && (
              <p className="text-red-500 text-sm ml-1 font-bold">{formErrors.error.mood[0]}</p>
            )}
          </div>

          {/* Toast / Status Message */}
          {state?.message && (
            <div className={`p-4 border-2 border-black rounded-xl text-xs font-black shadow-[2px_2px_0_0_#000] text-center ${state.success !== false ? "bg-[#60D689] text-black" : "bg-[#FF7676] text-black"
              }`}>
              {state.message}
            </div>
          )}

          {/* Tombol Simpan */}
          <button
            type="submit"
            disabled={isPending}
            className={clsx("disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed w-full mt-6 py-4 bg-[#E4F087] text-black border-4 border-black font-black text-sm uppercase rounded-2xl shadow-[4px_4px_0_0_#000] hover:bg-[#d4e076] transition-transform active:translate-y-[4px] active:translate-x-[4px] active:shadow-none", isPending && "cursor-not-allowed")}
          >
            {isPending ? t("menyimpan") : t("simpan_transaksi")}
          </button>

        </div>
      </form>
    </div>
  );
}
