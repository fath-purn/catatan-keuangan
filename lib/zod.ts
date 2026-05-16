import { z } from "zod";

export const SuratSchema = z.object({
  jenisSurat: z.string().min(1, "Pilih jenis surat"),
  nik: z.string().length(16, "NIK harus 16 karakter"),
  nama: z.string().min(3, "Nama minimal 3 karakter"),
  noHp: z.string().min(10, "Nomor HP minimal 10 digit"),
  rt: z.string().min(1, "RT harus diisi"),
  rw: z.string().min(1, "RW harus diisi"),
  keperluan: z.string().min(5, "Berikan detail keperluan yang jelas"),
});

export const RegisterSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const LoginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(1, "Password harus diisi"),
});

export const PostSchema = z.object({
  title: z.string().min(5, "Judul minimal 5 karakter"),
  slug: z.string().min(5, "Slug minimal 5 karakter"),
  content: z.string().min(10, "Konten minimal 10 karakter"),
  image: z.string().optional(),
  excerpt: z.string().optional(),
  category: z.string().optional(),
  published: z.boolean().optional(),
});

export const AnnouncementSchema = z.object({
  title: z.string().min(5, "Judul minimal 5 karakter"),
  slug: z.string().min(5, "Slug minimal 5 karakter"),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  important: z.boolean().optional(),
  published: z.boolean().optional(),
  category: z.string().optional(),
});

export const AgendaSchema = z.object({
  title: z.string().min(5, "Judul minimal 5 karakter"),
  date: z.string().min(1, "Tanggal harus diisi"),
  time: z.string().optional(),
  location: z.string().min(3, "Lokasi minimal 3 karakter"),
  description: z.string().optional(),
  category: z.string().optional(),
});

export const GallerySchema = z.object({
  title: z.string().min(5, "Judul minimal 5 karakter"),
  imageUrl: z.string().min(1, "Gambar harus diunggah"),
  category: z.string().optional(),
  description: z.string().optional(),
});

export const PopulationStatSchema = z.object({
  maleCount: z.coerce.number().min(0),
  femaleCount: z.coerce.number().min(0),
  headOfFamily: z.coerce.number().min(0),
  age0to14: z.coerce.number().min(0),
  age15to64: z.coerce.number().min(0),
  age65Plus: z.coerce.number().min(0),
  year: z.coerce.number().min(1900).max(2100),
});

export const VillageStatSchema = z.object({
  label: z.string().min(1, "Label harus diisi"),
  value: z.string().min(1, "Value harus diisi"),
  icon: z.string().optional(),
  order: z.coerce.number().default(0),
});

export const RWSchema = z.object({
  number: z.string().min(1, "Nomor RW harus diisi"),
  head: z.string().min(3, "Nama Ketua RW minimal 3 karakter"),
  address: z.string().min(5, "Alamat minimal 5 karakter"),
  dusun: z.string().min(1, "Dusun harus diisi"),
});

export const RTSchema = z.object({
  number: z.string().min(1, "Nomor RT harus diisi"),
  head: z.string().min(3, "Nama Ketua RT minimal 3 karakter"),
  dusun: z.string().optional(),
  rwId: z.string().min(1, "RW harus dipilih"),
});

export const OfficialSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  position: z.string().min(3, "Jabatan minimal 3 karakter"),
  imageUrl: z.string().optional(),
  order: z.coerce.number().default(0),
  active: z.boolean().default(true),
});

export const ComplaintSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  phone: z.string().min(10, "Nomor HP minimal 10 digit"),
  category: z.string().min(1, "Kategori harus dipilih"),
  title: z.string().min(5, "Judul minimal 5 karakter"),
  content: z.string().min(10, "Isi pengaduan minimal 10 karakter"),
  imageUrl: z.string().optional(),
});
