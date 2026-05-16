const indonesianMonths: { [key: string]: string } = {
  Januari: "January",
  Februari: "February",
  Maret: "March",
  April: "April",
  Mei: "May",
  Juni: "June",
  Juli: "July",
  Agustus: "August",
  September: "September",
  Oktober: "October",
  November: "November",
  Desember: "December",
};

const parseDate = (dateString: string | Date): Date => {
  const date = new Date(dateString);
  if (!isNaN(date.getTime())) {
    return date;
  }

  const parts = String(dateString).split(" ");
  if (parts.length === 3) {
    const [day, month, year] = parts;
    const englishMonth = indonesianMonths[month];
    if (englishMonth) {
      return new Date(`${day} ${englishMonth} ${year}`);
    }
  }

  return new Date(NaN); // Return Invalid Date
};

export const formatDate = (dateStr: string | Date) => {
  const date = parseDate(dateStr);
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }
  const formatter = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
  });
  return formatter.format(date);
};
export const formatCurrency = (amount: number) => {
  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumSignificantDigits: 3,
  });
  return formatter.format(amount);
};

export const formatCamelCase = (str: string) => {
  // Menambahkan spasi sebelum huruf kapital, kecuali di awal string
  return str.replace(/([A-Z])/g, " $1").trim();
};

export const CATEGORY_LABELS: Record<string, string> = {
  // Village Categories
  BERITA: "Berita Utama",
  KEGIATAN: "Kegiatan Desa",
  PEMERINTAHAN: "Pemerintahan",
  KESEHATAN: "Kesehatan",
  LINGKUNGAN: "Lingkungan",
  SOSIAL: "Sosial & Masyarakat",
  LAYANAN_UMUM: "Layanan Umum",
  ADMINISTRASI: "Administrasi",
  LAINNYA: "Lainnya",
};

export const formatDateKelola = (dateString: string | Date) => {
  const date = parseDate(dateString);
  if (!isNaN(date.getTime())) {
    return date.toLocaleDateString("id-ID");
  }
  return "Invalid Date";
};
