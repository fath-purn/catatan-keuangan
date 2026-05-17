import { z } from "zod";

export const TransactionSchema = z.object({
  nominal: z.coerce.number().min(1, "Nominal harus lebih besar dari 0"),
  judul: z.string().min(1, "Keterangan harus diisi"),
  tanggal: z.preprocess((arg) => {
    if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
    return arg;
  }, z.date()),
  waktu: z.string().min(1, "Waktu harus diisi"),
  kategori: z.string().min(1, "Kategori harus dipilih"),
  aset: z.string().min(1, "Aset harus dipilih"),
  mood: z.string().default("Biasa"),
  keperluan: z.string().min(1, "Keperluan harus dipilih"),
  jenis_transaksi: z.preprocess((val) => {
    if (val === "true" || val === true) return true;
    if (val === "false" || val === false) return false;
    return val;
  }, z.boolean()),
  goalId: z.string().nullable().optional(),
});

export const RegisterSchema = z.object({
  name: z.string().min(1, "Nama harus diisi"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const LoginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(1, "Password harus diisi"),
});

export const GoalSchema = z.object({
  nama: z.string().min(1, "Nama target tabungan harus diisi"),
  icon: z.string().default("🎯"),
  target: z.coerce.number().min(1, "Target tabungan harus lebih besar dari 0"),
  tenggatWaktu: z.preprocess((arg) => {
    if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
    return arg;
  }, z.date()),
  warnaBackground: z.string().default("#DBCBFF"),
  motivasi: z.string().nullable().optional(),
});

