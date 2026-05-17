"use server";

import { prisma } from "@/lib/prisma";
import { GoalSchema } from "@/lib/zod";
import { auth } from "@/auth";
import { revalidatePath, updateTag } from "next/cache";

export async function createGoalAction(prevState: any, formData: FormData) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return { success: false, message: "User tidak terautentikasi." };
  }

  const userId = session.user.id;

  // Bersihkan nominal string (misal: "15.000.000" -> "15000000")
  const rawTarget = formData.get("target") as string;
  const cleanedTarget = rawTarget ? rawTarget.replace(/[^0-9]/g, "") : "";

  const rawData = {
    nama: formData.get("nama"),
    icon: formData.get("icon") || "🎯",
    target: cleanedTarget,
    tenggatWaktu: formData.get("tenggatWaktu"),
    warnaBackground: formData.get("warnaBackground") || "#DBCBFF",
    motivasi: formData.get("motivasi") || null,
  };

  const validatedFields = GoalSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      error: validatedFields.error.flatten().fieldErrors,
      message: "Data tidak valid. Periksa kembali form Anda.",
    };
  }

  const data = validatedFields.data;

  try {
    await prisma.goal.create({
      data: {
        nama: data.nama,
        icon: data.icon,
        target: data.target,
        terkumpul: 0, // Nilai awal selalu 0
        tenggatWaktu: data.tenggatWaktu,
        warnaBackground: data.warnaBackground,
        motivasi: data.motivasi,
        userId,
      },
    });

    revalidatePath("/goals");
    revalidatePath("/");
    revalidatePath("/transaksi");
    updateTag("goals");
    updateTag("dashboard");

    return { success: true, message: "Goal berhasil disimpan." };
  } catch (error) {
    console.error("Create goal error:", error);
    return { success: false, message: "Gagal menyimpan goal." };
  }
}

export async function updateGoalAction(prevState: any, formData: FormData) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return { success: false, message: "User tidak terautentikasi." };
  }

  const userId = session.user.id;
  const goalId = formData.get("id") as string;

  if (!goalId) {
    return { success: false, message: "ID goal tidak ditemukan." };
  }

  // Bersihkan nominal string (misal: "15.000.000" -> "15000000")
  const rawTarget = formData.get("target") as string;
  const cleanedTarget = rawTarget ? rawTarget.replace(/[^0-9]/g, "") : "";

  const rawData = {
    nama: formData.get("nama"),
    icon: formData.get("icon") || "🎯",
    target: cleanedTarget,
    tenggatWaktu: formData.get("tenggatWaktu"),
    warnaBackground: formData.get("warnaBackground") || "#DBCBFF",
    motivasi: formData.get("motivasi") || null,
  };

  const validatedFields = GoalSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      error: validatedFields.error.flatten().fieldErrors,
      message: "Data tidak valid. Periksa kembali form Anda.",
    };
  }

  const data = validatedFields.data;

  try {
    const existingGoal = await prisma.goal.findUnique({
      where: { id: goalId },
    });

    if (!existingGoal || existingGoal.userId !== userId) {
      return { success: false, message: "Goal tidak ditemukan atau Anda tidak memiliki akses." };
    }

    await prisma.goal.update({
      where: { id: goalId },
      data: {
        nama: data.nama,
        icon: data.icon,
        target: data.target,
        tenggatWaktu: data.tenggatWaktu,
        warnaBackground: data.warnaBackground,
        motivasi: data.motivasi,
      },
    });

    revalidatePath("/goals");
    revalidatePath("/");
    revalidatePath("/transaksi");
    updateTag("goals");
    updateTag("dashboard");

    return { success: true, message: "Goal berhasil diperbarui." };
  } catch (error) {
    console.error("Update goal error:", error);
    return { success: false, message: "Gagal memperbarui goal." };
  }
}

export async function deleteGoalAction(goalId: string) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return { success: false, message: "User tidak terautentikasi." };
  }

  const userId = session.user.id;

  try {
    const existingGoal = await prisma.goal.findUnique({
      where: { id: goalId },
    });

    if (!existingGoal || existingGoal.userId !== userId) {
      return { success: false, message: "Goal tidak ditemukan atau Anda tidak memiliki akses." };
    }

    await prisma.goal.delete({
      where: { id: goalId },
    });

    revalidatePath("/goals");
    revalidatePath("/");
    revalidatePath("/transaksi");
    updateTag("goals");
    updateTag("dashboard");

    return { success: true, message: "Goal berhasil dihapus." };
  } catch (error) {
    console.error("Delete goal error:", error);
    return { success: false, message: "Gagal menghapus goal." };
  }
}
