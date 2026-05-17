// export type FormStateSurat = {
//   message?: string;
//   error?: {
//     jenisSurat?: string[];
//     nik?: string[];
//     nama?: string[];
//     noHp?: string[];
//     rt?: string[];
//     rw?: string[];
//     keperluan?: string[];
//   };
// };

// export type FormStateAnnouncement = {
//   title?: string[];
//   slug?: string[];
//   description?: string[];
//   important?: string[];
//   published?: string[];
//   category?: string[];
// };

export type FormStateTransaction = {
  message?: string;
  error?: {
    nominal?: string[];
    judul?: string[];
    tanggal?: string[];
    waktu?: string[];
    kategori?: string[];
    aset?: string[];
    mood?: string[];
    keperluan?: string[];
    jenis_transaksi?: string[];
    goalId?: string[];
  };
};

export type FullTransaction = {
  id: string;
  tanggal: string;
  hari: string;
  bulan: string;
  tahun: string;
  totalPendapatan: string;
  totalPengeluaran: string;
  data: Transaction[];
};

export type Transaction = {
  id: number;
  jenis: string;
  nominal: string;
  waktu: string;
  kategori: string;
  aset: string;
  mood: string;
  jenis_transaksi: boolean;
  tanggal: string;
  bulan: string;
  tahun: string;
  keperluan: string;
};

export type GoalTransaction = {
  id: string;
  label: string;
  icon: string;
  target: number;
  terkumpul: number;
  warnaBackground: string;
};
