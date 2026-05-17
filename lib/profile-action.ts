"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { ProfileSchema } from "@/lib/zod";
import { revalidatePath } from "next/cache";

export async function updateProfileAction(prevState: any, formData: FormData) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return { success: false, message: "User tidak terautentikasi." };
  }

  const userId = session.user.id;

  // Clean raw lifestyle target input (e.g. "5.000.000" -> "5000000")
  const rawTarget = formData.get("targetGayaHidup") as string;
  const cleanedTarget = rawTarget ? rawTarget.replace(/[^0-9]/g, "") : "0";

  const rawData = {
    name: formData.get("name"),
    avatar: formData.get("avatar"),
    targetGayaHidup: cleanedTarget,
  };

  const validatedFields = ProfileSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      error: validatedFields.error.flatten().fieldErrors,
      message: "Data tidak valid. Periksa kembali input Anda.",
    };
  }

  const data = validatedFields.data;

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        avatar: data.avatar,
        targetGayaHidup: data.targetGayaHidup,
      },
    });

    revalidatePath("/profile");
    revalidatePath("/");
    revalidatePath("/laporan");

    return { success: true, message: "Profile berhasil disimpan." };
  } catch (error) {
    console.error("Update profile error:", error);
    return { success: false, message: "Gagal memperbarui profile." };
  }
}
