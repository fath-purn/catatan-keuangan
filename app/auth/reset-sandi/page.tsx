"use client";

import { useActionState, use } from "react";
import { resetPasswordAction } from "@/lib/auth-actions";
import { IoShieldCheckmark, IoLockClosed, IoSync } from "react-icons/io5";

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const params = use(searchParams);
  const email = params?.email || "";
  const [state, action, pending] = useActionState(resetPasswordAction, null);

  return (
    <main className="min-h-full bg-[#FDF8EE] flex flex-col items-center justify-center p-6 py-12 relative overflow-hidden text-black font-sans">
      <div className="w-full max-w-sm space-y-8 relative z-10">
        <div className="text-center space-y-2 mb-8">
          <div className="inline-block px-3 py-1 bg-[#E4F087] text-black border-2 border-black shadow-[2px_2px_0_0_#000] text-xs font-black uppercase rounded-lg mb-2">
            Reset Kata Sandi
          </div>
          <h1 className="text-4xl font-black text-black tracking-tight leading-none uppercase">Atur Ulang</h1>
          <p className="text-xs font-bold text-gray-600 mt-2">
            Masukkan kode yang dikirim ke <br/>
            <span className="text-black">{email || "email kamu"}</span>
          </p>
        </div>

        <div className="w-full bg-white border-4 border-black rounded-3xl p-6 shadow-[4px_4px_0_0_#000]">
          <form action={action} className="space-y-5">
            <input type="hidden" name="email" value={email} />
            
            {state?.message && (
              <div className="p-3 bg-[#FF7676] text-black border-2 border-black rounded-xl shadow-[2px_2px_0_0_#000] text-xs font-black text-center uppercase">
                {state.message}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-black uppercase">Kode OTP</label>
                <div className="relative">
                  <IoShieldCheckmark className="absolute left-4 top-1/2 -translate-y-1/2 text-black text-lg" />
                  <input
                    type="text"
                    name="code"
                    maxLength={6}
                    placeholder="000000"
                    className="w-full pl-11 pr-4 py-3 bg-[#FDF8EE] border-2 border-black rounded-xl shadow-inner focus:outline-none focus:border-black transition-all text-black font-black text-xl tracking-[5px] placeholder:tracking-normal placeholder:text-gray-300"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-black uppercase">Kata Sandi Baru</label>
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
              className="w-full py-4 mt-2 bg-[#60D689] text-black border-2 border-black rounded-xl font-black uppercase text-sm shadow-[2px_2px_0_0_#000] active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {pending ? <IoSync className="animate-spin text-lg" /> : "Simpan Kata Sandi"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
