"use server";

import { prisma } from "@/lib/prisma";
import { TransactionSchema } from "@/lib/zod";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function createTransactionAction(prevState: any, formData: FormData) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return { success: false, message: "User tidak terautentikasi." };
  }

  const userId = session.user.id;

  // Bersihkan nominal string (misal: "3.000.000" -> "3000000")
  const rawNominal = formData.get("nominal") as string;
  const cleanedNominal = rawNominal ? rawNominal.replace(/[^0-9]/g, "") : "";

  const rawData = {
    nominal: cleanedNominal,
    judul: formData.get("judul"),
    tanggal: formData.get("tanggal"),
    waktu: formData.get("waktu"),
    kategori: formData.get("kategori"),
    aset: formData.get("aset"),
    mood: formData.get("mood") || "Biasa",
    keperluan: formData.get("keperluan"),
    jenis_transaksi: formData.get("jenis_transaksi"),
    goalId: formData.get("goalId") || null,
  };

  const validatedFields = TransactionSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      error: validatedFields.error.flatten().fieldErrors,
      message: "Data tidak valid. Periksa kembali form Anda.",
    };
  }

  const data = validatedFields.data;

  try {
    // Lakukan pembuatan transaksi dan update tabungan pada Goal jika goalId disertakan
    await prisma.$transaction(async (tx) => {
      await tx.transaction.create({
        data: {
          nominal: data.nominal,
          judul: data.judul,
          tanggal: data.tanggal,
          waktu: data.waktu,
          kategori: data.kategori,
          aset: data.aset,
          mood: data.mood,
          keperluan: data.keperluan,
          jenis_transaksi: data.jenis_transaksi,
          userId,
          goalId: data.goalId || null,
        },
      });

      // Jika ada target goals yang terhubung, update "terkumpul" di tabel Goal
      if (data.goalId) {
        const goal = await tx.goal.findUnique({
          where: { id: data.goalId },
        });

        if (goal) {
          // Jika jenis_transaksi = false (Pengeluaran/menabung ke goal): menambah nominal terkumpul
          // Jika jenis_transaksi = true (Pemasukan/penarikan dari goal): mengurangi nominal terkumpul
          const adjustment = data.jenis_transaksi ? -data.nominal : data.nominal;
          await tx.goal.update({
            where: { id: data.goalId },
            data: {
              terkumpul: {
                increment: adjustment,
              },
            },
          });
        }
      }
    });

    revalidatePath("/transaksi");
    revalidatePath("/");
    revalidatePath("/laporan");
    revalidatePath("/goals");

    return { success: true, message: "Transaksi berhasil disimpan." };
  } catch (error) {
    console.error("Create transaction error:", error);
    return { success: false, message: "Gagal menyimpan transaksi." };
  }
}

export async function updateTransactionAction(prevState: any, formData: FormData) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return { success: false, message: "User tidak terautentikasi." };
  }

  const userId = session.user.id;
  const transactionId = formData.get("id") as string;
  if (!transactionId) {
    return { success: false, message: "ID transaksi tidak valid." };
  }

  // Bersihkan nominal string (misal: "3.000.000" -> "3000000")
  const rawNominal = formData.get("nominal") as string;
  const cleanedNominal = rawNominal ? rawNominal.replace(/[^0-9]/g, "") : "";

  const rawData = {
    nominal: cleanedNominal,
    judul: formData.get("judul"),
    tanggal: formData.get("tanggal"),
    waktu: formData.get("waktu"),
    kategori: formData.get("kategori"),
    aset: formData.get("aset"),
    mood: formData.get("mood") || "Biasa",
    keperluan: formData.get("keperluan"),
    jenis_transaksi: formData.get("jenis_transaksi"),
    goalId: formData.get("goalId") || null,
  };

  const validatedFields = TransactionSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      error: validatedFields.error.flatten().fieldErrors,
      message: "Data tidak valid. Periksa kembali form Anda.",
    };
  }

  const data = validatedFields.data;

  try {
    const existingTx = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!existingTx || existingTx.userId !== userId) {
      return { success: false, message: "Transaksi tidak ditemukan atau Anda tidak memiliki akses." };
    }

    await prisma.$transaction(async (tx) => {
      // 1. Revert nominal terkumpul dari Goal yang lama
      if (existingTx.goalId) {
        const oldAdjustment = existingTx.jenis_transaksi ? -existingTx.nominal : existingTx.nominal;
        await tx.goal.update({
          where: { id: existingTx.goalId },
          data: {
            terkumpul: {
              decrement: oldAdjustment,
            },
          },
        });
      }

      // 2. Update data transaksi
      await tx.transaction.update({
        where: { id: transactionId },
        data: {
          nominal: data.nominal,
          judul: data.judul,
          tanggal: data.tanggal,
          waktu: data.waktu,
          kategori: data.kategori,
          aset: data.aset,
          mood: data.mood,
          keperluan: data.keperluan,
          jenis_transaksi: data.jenis_transaksi,
          goalId: data.goalId || null,
        },
      });

      // 3. Tambahkan nominal terkumpul ke Goal yang baru jika ada
      if (data.goalId) {
        const newAdjustment = data.jenis_transaksi ? -data.nominal : data.nominal;
        await tx.goal.update({
          where: { id: data.goalId },
          data: {
            terkumpul: {
              increment: newAdjustment,
            },
          },
        });
      }
    });

    revalidatePath("/transaksi");
    revalidatePath("/");
    revalidatePath("/laporan");
    revalidatePath("/goals");

    return { success: true, message: "Transaksi berhasil diperbarui." };
  } catch (error) {
    console.error("Update transaction error:", error);
    return { success: false, message: "Gagal memperbarui transaksi." };
  }
}

export async function deleteTransactionAction(transactionId: string) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return { success: false, message: "User tidak terautentikasi." };
  }

  const userId = session.user.id;

  try {
    const existingTx = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!existingTx || existingTx.userId !== userId) {
      return { success: false, message: "Transaksi tidak ditemukan atau Anda tidak memiliki akses." };
    }

    await prisma.$transaction(async (tx) => {
      // Kembalikan nominal pada Goal terlebih dahulu jika terhubung dengan goal
      if (existingTx.goalId) {
        const oldAdjustment = existingTx.jenis_transaksi ? -existingTx.nominal : existingTx.nominal;
        await tx.goal.update({
          where: { id: existingTx.goalId },
          data: {
            terkumpul: {
              decrement: oldAdjustment,
            },
          },
        });
      }

      // Hapus transaksi
      await tx.transaction.delete({
        where: { id: transactionId },
      });
    });

    revalidatePath("/transaksi");
    revalidatePath("/");
    revalidatePath("/laporan");
    revalidatePath("/goals");

    return { success: true, message: "Transaksi berhasil dihapus." };
  } catch (error) {
    console.error("Delete transaction error:", error);
    return { success: false, message: "Gagal menghapus transaksi." };
  }
}
