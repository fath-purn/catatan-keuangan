"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/auth-actions";
import Link from "next/link";
import { IoMail, IoLockClosed, IoSync } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.message === "success") {
      router.push("/");
      router.refresh();
    }
  }, [state, router]);

  return (
    <div className="w-full bg-white border-4 border-black rounded-3xl p-6 shadow-[4px_4px_0_0_#000]">
      <div className="mb-6 border-b-2 border-black pb-4 text-center">
        <h2 className="text-2xl font-black text-black uppercase tracking-tight">Selamat Datang</h2>
        <p className="text-[10px] font-bold text-gray-600 mt-1 uppercase">Masuk untuk mengelola keuanganmu.</p>
      </div>

      <form action={action} className="space-y-5">
        {state?.message === "Email atau password salah." && (
          <div className="p-3 bg-[#FF7676] text-black border-2 border-black rounded-xl shadow-[2px_2px_0_0_#000] text-xs font-black text-center uppercase">
            {state?.message}
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-black text-black uppercase">Email</label>
            <div className="relative">
              <IoMail className="absolute left-4 top-1/2 -translate-y-1/2 text-black text-lg" />
              <input
                type="email"
                name="email"
                placeholder="user@email.com"
                className="w-full pl-11 pr-4 py-3 bg-[#FDF8EE] border-2 border-black rounded-xl shadow-inner focus:outline-none focus:border-black transition-all text-black font-bold text-sm placeholder:text-gray-400"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-black text-black uppercase">Password</label>
              <Link href="/auth/lupa-sandi" className="text-[10px] font-black text-gray-500 hover:text-black uppercase">Lupa Sandi?</Link>
            </div>
            <div className="relative">
              <IoLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-black text-lg" />
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-[#FDF8EE] border-2 border-black rounded-xl shadow-inner focus:outline-none focus:border-black transition-all text-black font-bold text-sm placeholder:text-gray-400"
                required
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full py-3 mt-2 bg-[#E4F087] text-black border-2 border-black rounded-xl font-black uppercase text-sm shadow-[2px_2px_0_0_#000] active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {pending ? <IoSync className="animate-spin text-lg" /> : "Masuk Sekarang"}
        </button>

        <p className="text-center text-[10px] font-black text-black mt-4">
          Belum punya akun?{" "}
          <Link href="/register" className="text-[#60D689] bg-white px-2 py-1 border-2 border-black rounded-lg shadow-[1px_1px_0_0_#000] active:scale-95 transition-transform inline-block ml-1">
            Daftar di sini
          </Link>
        </p>
      </form>
    </div>
  );
}
