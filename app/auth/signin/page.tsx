import LoginForm from "@/components/auth/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Catatan Keuangan",
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect_url?: string }>;
}) {
  const params = (await searchParams)?.redirect_url;
  let redirectUrl;
  if (!params) {
    redirectUrl = "/";
  } else {
    redirectUrl = `/${params}`;
  }

  return (
    <main className="min-h-full bg-[#FDF8EE] flex flex-col items-center justify-center p-6 py-12 relative overflow-hidden text-black font-sans">
      <div className="w-full max-w-sm space-y-8 relative z-10">
        <div className="text-center space-y-2 mb-8">
          <div className="inline-block px-3 py-1 bg-[#DBCBFF] text-black border-2 border-black shadow-[2px_2px_0_0_#000] text-xs font-black uppercase rounded-lg mb-2">
            Masuk Akun
          </div>
          <h1 className="text-4xl font-black text-black tracking-tight leading-none uppercase">Catatan<br/>Keuangan</h1>
        </div>

        <LoginForm />
      </div>
    </main>
  );
}
