"use client";

import { useActionState, useState, useEffect } from "react";
import { verifyAction, resendCodeAction } from "@/lib/auth-actions";
import { IoShieldCheckmark, IoSync, IoMailUnread } from "react-icons/io5";

export default function VerifyForm({ email }: { email: string }) {
  const [state, action, pending] = useActionState(verifyAction, null);
  const [countdown, setCountdown] = useState(0);
  const [resendStatus, setResendStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  // Timer logic for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResend = async () => {
    if (countdown > 0) return;
    
    setCountdown(60); // 1 minute
    const result = await resendCodeAction(email);
    setResendStatus(result);
    
    // Clear status message after 5 seconds
    setTimeout(() => setResendStatus(null), 5000);
  };

  return (
    <div className="w-full bg-white border-4 border-black rounded-3xl p-6 shadow-[4px_4px_0_0_#000]">
      <div className="mb-6 border-b-2 border-black pb-4 text-center">
        <h2 className="text-2xl font-black text-black uppercase tracking-tight">Masukkan Kode</h2>
        <p className="text-[10px] font-bold text-gray-600 mt-1 uppercase">Kode 6-digit OTP</p>
      </div>

      <form action={action} className="space-y-5">
        <input type="hidden" name="email" value={email} />
        
        {state?.message && (
          <div className="p-3 bg-[#FF7676] text-black border-2 border-black rounded-xl shadow-[2px_2px_0_0_#000] text-xs font-black text-center uppercase">
            {state?.message}
          </div>
        )}

        {resendStatus?.message && (
          <div className={`p-3 border-2 border-black rounded-xl shadow-[2px_2px_0_0_#000] text-xs font-black text-center uppercase ${resendStatus.success ? 'bg-[#60D689]' : 'bg-[#FF7676]'}`}>
            {resendStatus.message}
          </div>
        )}

        <div className="space-y-4 text-center">
          <div className="relative">
            <IoShieldCheckmark className="absolute left-4 top-1/2 -translate-y-1/2 text-black text-lg" />
            <input
              type="text"
              name="code"
              maxLength={6}
              placeholder="000000"
              className="w-full pl-11 pr-4 py-4 bg-[#FDF8EE] border-2 border-black rounded-xl shadow-inner focus:outline-none focus:border-black transition-all text-black font-black text-2xl tracking-[10px] text-center placeholder:text-gray-300 placeholder:tracking-normal"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full py-4 mt-2 bg-[#60D689] text-black border-2 border-black rounded-xl font-black uppercase text-sm shadow-[2px_2px_0_0_#000] active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {pending ? <IoSync className="animate-spin text-lg" /> : "Verifikasi Sekarang"}
        </button>

        <div className="pt-4 text-center border-t-2 border-black border-dashed">
          <p className="text-[10px] font-black text-gray-500 uppercase mb-2">Tidak menerima kode?</p>
          <button
            type="button"
            onClick={handleResend}
            disabled={countdown > 0}
            className={`flex items-center justify-center gap-2 mx-auto px-4 py-2 border-2 border-black rounded-lg text-xs font-black uppercase transition-all shadow-[2px_2px_0_0_#000] active:scale-95 ${countdown > 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none' : 'bg-[#DBCBFF] text-black hover:bg-[#c4b1ff]'}`}
          >
            <IoMailUnread className="text-sm" />
            {countdown > 0 ? `Kirim Ulang (${countdown}s)` : "Kirim Ulang Kode"}
          </button>
        </div>
      </form>
    </div>
  );
}
