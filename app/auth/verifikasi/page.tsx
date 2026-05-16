import VerifyForm from "@/components/auth/verify-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verifikasi Email | Catatan Keuangan",
};

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const email = (await searchParams)?.email;

  return (
    <main className="min-h-full bg-[#FDF8EE] flex flex-col items-center justify-center p-6 py-12 relative overflow-hidden text-black font-sans">
      <div className="w-full max-w-sm space-y-8 relative z-10">
        <div className="text-center space-y-2 mb-8">
          <div className="inline-block px-3 py-1 bg-[#FFB443] text-black border-2 border-black shadow-[2px_2px_0_0_#000] text-xs font-black uppercase rounded-lg mb-2">
            Verifikasi Email
          </div>
          <h1 className="text-4xl font-black text-black tracking-tight leading-none uppercase">Cek Email Kamu</h1>
          <p className="text-xs font-bold text-gray-600 mt-2">
            Kami telah mengirimkan kode verifikasi ke <br />
            <span className="text-black">{email || "email kamu"}</span>
          </p>
        </div>

        <VerifyForm email={email || ""} />
      </div>
    </main>
  );
}
