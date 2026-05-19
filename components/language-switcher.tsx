"use client";

import { useLanguage } from "@/components/language-provider";
import { useRouter } from "next/navigation";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();
  const router = useRouter();

  const toggleLanguage = () => {
    const nextLocale = locale === "id" ? "en" : "id";
    setLocale(nextLocale);
    router.refresh();
  };

  return (
    <button
      onClick={toggleLanguage}
      aria-label={locale === "id" ? "Change Language" : "Ganti Bahasa"}
      className="p-2.5 bg-white border-2 border-black rounded-xl shadow-[3px_3px_0_0_#000] hover:shadow-[1px_1px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] active:scale-95 transition-all flex items-center justify-center font-black text-[11px] leading-none"
    >
      {locale === "id" ? "🇮🇩 ID" : "🇬🇧 EN"}
    </button>
  );
}
