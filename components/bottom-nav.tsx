"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiList, FiPlus, FiFlag, FiUser } from "react-icons/fi";
import clsx from "clsx";
import { useLanguage } from "@/components/language-provider";

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    { name: t("nav_beranda"), href: "/", icon: FiHome },
    { name: t("nav_transaksi"), href: "/transaksi", icon: FiList },
    { name: t("nav_tambah"), href: "/transaksi/tambah", icon: FiPlus, isMain: true },
    { name: t("nav_goals"), href: "/goals", icon: FiFlag },
    { name: t("nav_profile"), href: "/profile", icon: FiUser },
  ];

  return (
    <nav className="absolute bottom-0 md:bottom-8 w-full md:w-auto md:left-1/2 md:-translate-x-1/2 z-50 bg-[#FDF8EE] md:bg-white/70 md:backdrop-blur-lg border-t-4 md:border-4 border-black pb-safe md:pb-0 md:rounded-full md:shadow-[0_8px_32px_rgba(0,0,0,0.1),_4px_4px_0_0_#000] transition-all">
      <div className="flex justify-around items-center h-16 px-2 md:px-6 md:gap-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.isMain) {
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex flex-col items-center justify-center relative -top-6"
              >
                <div className="w-14 h-14 bg-[#FF7676] rounded-full flex items-center justify-center text-black border-4 border-black shadow-[4px_4px_0_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">
                  <Icon className="w-7 h-7" strokeWidth={3} />
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center justify-center w-full h-full space-y-1 transition-all relative"
            >
              <div className={clsx(
                "p-2 rounded-xl border-2 transition-all",
                isActive ? "bg-[#E4F087] border-black shadow-[2px_2px_0_0_#000]" : "border-transparent bg-transparent"
              )}>
                <Icon className={clsx("w-5 h-5 transition-all", isActive ? "text-black stroke-[3px]" : "text-black/60")} strokeWidth={isActive ? 3 : 2} />
              </div>
              <span className={clsx("text-[10px] transition-all", isActive ? "font-black text-black" : "font-bold text-black/60")}>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
