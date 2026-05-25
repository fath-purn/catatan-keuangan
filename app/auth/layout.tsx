import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "../globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Finfeel",
  description: "Aplikasi Finfeel Pribadi",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans antialiased bg-[#FDF8EE] h-[100dvh] flex flex-col overflow-hidden`}>

        {/* Full View Container */}
        <div className="w-full h-full relative flex flex-col overflow-hidden">

          {/* Main Content Area (Scrollable) */}
          <main className="flex-1 overflow-y-auto text-gray-900 relative">
            {children}
          </main>

        </div>

      </body>
    </html>
  );
}
