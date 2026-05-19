import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "../globals.css";
import BottomNav from "@/components/bottom-nav";
import { LanguageProvider } from "@/components/language-provider";
import { cookies } from "next/headers";
import { Locale } from "@/lib/translations";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Catatan Keuangan",
  description: "Aplikasi Catatan Keuangan Pribadi",
};


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("app_locale")?.value || "id") as Locale;

  return (
    <html lang={locale}>
      <body className={`${poppins.variable} font-sans antialiased bg-slate-200 sm:py-6 h-[100dvh] flex justify-center items-center overflow-hidden`}>
        <LanguageProvider initialLocale={locale}>
          {/* Mobile View Container */}
          <div className="w-full sm:max-w-[400px] bg-gray-50 h-[100dvh] sm:h-[90vh] sm:rounded-[40px] sm:shadow-2xl relative flex flex-col sm:border-[8px] sm:border-slate-800 overflow-hidden">
            
            {/* Main Content Area (Scrollable) */}
            <main className="flex-1 overflow-y-auto text-gray-900 pb-24 relative">
              {children}
            </main>
            
            {/* Bottom Navigation */}
            <BottomNav />
            
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
