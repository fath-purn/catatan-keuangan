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
  title: "Finfeel",
  description: "Aplikasi Finfeel Pribadi",
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
      <body className={`${poppins.variable} font-sans antialiased bg-[#FDF8EE] h-[100dvh] overflow-hidden`}>
        <LanguageProvider initialLocale={locale}>
          {/* App Container */}
          <div className="w-full bg-[#FDF8EE] h-[100dvh] relative flex flex-col overflow-hidden">

            {/* Main Content Area (Scrollable) */}
            <main className="flex-1 overflow-y-auto overflow-x-hidden text-gray-900 pb-24 md:pb-32 relative custom-scrollbar">
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
