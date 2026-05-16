import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "../globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Catatan Keuangan",
  description: "Aplikasi Catatan Keuangan Pribadi",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans antialiased bg-slate-200 sm:py-6 h-[100dvh] flex justify-center items-center overflow-hidden`}>

        {/* Mobile View Container */}
        <div className="w-full sm:max-w-[400px] bg-gray-50 h-[100dvh] sm:h-[90vh] sm:rounded-[40px] sm:shadow-2xl relative flex flex-col sm:border-[8px] sm:border-slate-800 overflow-hidden">

          {/* Main Content Area (Scrollable) */}
          <main className="flex-1 overflow-y-auto text-gray-900 pb-24 relative">
            {children}
          </main>

          {/* Bottom Navigation */}
          {/* <BottomNav /> */}

        </div>

      </body>
    </html>
  );
}
