import RegisterForm from "@/components/auth/register-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registrasi | Catatan Keuangan",
};

export default function RegisterPage() {
  return (
    <main className="min-h-full bg-[#FDF8EE] flex flex-col items-center justify-center p-6 py-12 relative overflow-hidden text-black font-sans">
      <div className="w-full max-w-sm space-y-8 relative z-10">
        <div className="text-center space-y-2 mb-8">
          <div className="inline-block px-3 py-1 bg-[#60D689] text-black border-2 border-black shadow-[2px_2px_0_0_#000] text-xs font-black uppercase rounded-lg mb-2">
            Buat Akun
          </div>
          <h1 className="text-4xl font-black text-black tracking-tight leading-none uppercase">Catatan<br/>Keuangan</h1>
        </div>

        <RegisterForm />
      </div>
    </main>
  );
}
