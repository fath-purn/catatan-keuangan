"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, Locale, TranslationKey } from "@/lib/translations";

interface LanguageContextProps {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

interface LanguageProviderProps {
  children: React.ReactNode;
  initialLocale: Locale;
}

export function LanguageProvider({ children, initialLocale }: LanguageProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  // Sync client state with localStorage if it differs from server-passed initialLocale
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLocale = localStorage.getItem("app_locale") as Locale;
      if (savedLocale && (savedLocale === "id" || savedLocale === "en") && savedLocale !== initialLocale) {
        setLocaleState(savedLocale);
        document.cookie = `app_locale=${savedLocale}; path=/; max-age=31536000; SameSite=Lax`;
      }
    }
  }, [initialLocale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== "undefined") {
      localStorage.setItem("app_locale", newLocale);
      document.cookie = `app_locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    }
  };

  const t = (key: TranslationKey, params?: Record<string, string | number>) => {
    const text = translations[locale]?.[key] || translations["id"]?.[key] || String(key);
    if (!params) return text;

    let interpolatedText = text;
    Object.entries(params).forEach(([k, v]) => {
      interpolatedText = interpolatedText.replace(new RegExp(`{${k}}`, "g"), String(v));
    });
    return interpolatedText;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
