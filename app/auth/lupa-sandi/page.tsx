"use client";

import { useActionState } from "react";
import { forgotPasswordAction } from "@/lib/auth-actions";
import Link from "next/link";
import { IoMail, IoSync, IoArrowBack } from "react-icons/io5";

export default function ForgotPasswordPage() {
  const [state, action, pending] = useActionState(forgotPasswordAction, null);

  return (
    <main className="min-h-full bg-[#FDF8EE] flex flex-col items-center justify-center p-6 py-12 relative overflow-hidden text-black font-sans">
      <div className="w-full max-w-sm space-y-8 relative z-10">
        <div className="text-center space-y-2 mb-8">
          <Link href="/signin" className="inline-flex items-center gap-2 text-xs font-black uppercase text-gray-500 hover:text-black transition-colors mb-4">
            <IoArrowBack /> Kembali ke Login
          </Link>
          <h1 className="text-4xl font-black text-black tracking-tight leading-none uppercase">Lupa Sandi?</h1>
          <p className="text-xs font-bold text-gray-600 mt-2">
            Jangan khawatir! Masukkan email kamu untuk <br/> mendapatkan kode reset.
          </p>
        </div>

        <div className="w-full bg-white border-4 border-black rounded-3xl p-6 shadow-[4px_4px_0_0_#000]">
          <form action={action} className="space-y-5">
            {state?.message && (
              <div className="p-3 bg-[#FF7676] text-black border-2 border-black rounded-xl shadow-[2px_2px_0_0_#000] text-xs font-black text-center uppercase">
                {state.message}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-black text-black uppercase">Email Terdaftar</label>
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

            <button
              type="submit"
              disabled={pending}
              className="w-full py-4 mt-2 bg-[#DBCBFF] text-black border-2 border-black rounded-xl font-black uppercase text-sm shadow-[2px_2px_0_0_#000] active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {pending ? <IoSync className="animate-spin text-lg" /> : "Kirim Kode Reset"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
