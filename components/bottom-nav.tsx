"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiList, FiPlusCircle, FiPieChart, FiUser } from "react-icons/fi";
import clsx from "clsx";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Beranda", href: "/", icon: FiHome },
    { name: "Transaksi", href: "/transaksi", icon: FiList },
    { name: "Tambah", href: "/transaksi/tambah", icon: FiPlusCircle, isMain: true },
    { name: "Laporan", href: "/laporan", icon: FiPieChart },
    { name: "Profile", href: "/profile", icon: FiUser },
  ];

  return (
    <nav className="absolute bottom-0 w-full z-50 bg-white border-t border-gray-200 pb-safe shadow-[0_-2px_10px_rgba(0,0,0,0.05)] rounded-t-2xl">
      <div className="flex justify-around items-center h-16 px-2">
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
                <div className="w-14 h-14 bg-red-600 hover:bg-red-700 transition-colors rounded-full flex items-center justify-center text-white shadow-lg shadow-red-600/40 border-4 border-red-50">
                  <Icon className="w-7 h-7" />
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                isActive ? "text-red-600" : "text-gray-400 hover:text-red-500"
              )}
            >
              <Icon className={clsx("w-6 h-6", isActive && "stroke-[2.5px]")} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
