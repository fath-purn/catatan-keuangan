"use server";

import { prisma } from "@/lib/prisma";
import { RegisterSchema, LoginSchema } from "@/lib/zod";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { sendVerificationEmail } from "@/lib/mail";
import { success } from "zod";

export async function registerAction(prevState: any, formData: FormData) {
  const validatedFields = RegisterSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = validatedFields.data;

  try {
    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      return { success: false, message: "Email sudah terdaftar." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 menit

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        code: otpCode,
        codeExpires: otpExpires,
      },
    });

    // mengirimkan kode verifikasi ke email
    await sendVerificationEmail(email, otpCode);

    redirect(`/auth/verifikasi?email=${encodeURIComponent(email)}`);
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    console.error("Registration error:", error);
    return { success: false, message: "Terjadi kesalahan saat registrasi." };
  }
}

export async function loginAction(prevState: any, formData: FormData) {
  const validatedFields = LoginSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  // Check if user is verified before signing in
  const user = await prisma.user.findUnique({ where: { email } });
  
  if (user && user.password) {
    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (passwordsMatch && !user.isEmailVerifeid) {
       redirect(`/auth/verifikasi?email=${encodeURIComponent(email)}`);
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { message: "Email atau password salah." };
        default:
          return { message: "Terjadi kesalahan saat login." };
      }
    }
    throw error; // Penting agar Next.js bisa menangani redirect
  }
}

export async function verifyAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const code = formData.get("code") as string;

  if (!email || !code) {
    return { message: "Data tidak lengkap." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { message: "Pengguna tidak ditemukan." };
    }

    if (user.code !== code) {
      return { message: "Kode verifikasi salah." };
    }

    if (user.codeExpires && new Date() > user.codeExpires) {
      return { message: "Kode verifikasi telah kedaluwarsa." };
    }

    await prisma.user.update({
      where: { email },
      data: {
        isEmailVerifeid: true, // Menggunakan typo sesuai schema kamu
        code: null,
        codeExpires: null,
      },
    });

    redirect("/auth/signin?verified=true");
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    return { message: "Terjadi kesalahan saat verifikasi." };
  }
}

export async function resendCodeAction(email: string) {
  if (!email) return { message: "Email tidak ditemukan." };

  try {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({
      where: { email },
      data: {
        code: otpCode,
        codeExpires: otpExpires,
      },
    });

    await sendVerificationEmail(email, otpCode);
    return { success: true, message: "Kode baru telah dikirim!" };
  } catch (error) {
    return { message: "Gagal mengirim ulang kode." };
  }
}

export async function forgotPasswordAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;

  if (!email) return { message: "Email wajib diisi." };

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { message: "Email tidak terdaftar." };
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({
      where: { email },
      data: {
        code: otpCode,
        codeExpires: otpExpires,
      },
    });

    await sendVerificationEmail(email, otpCode, true); // true for reset password template

    redirect(`/auth/reset-sandi?email=${encodeURIComponent(email)}`);
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    return { message: "Gagal memproses permintaan." };
  }
}

export async function resetPasswordAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const code = formData.get("code") as string;
  const password = formData.get("password") as string;

  if (!email || !code || !password) {
    return { message: "Data tidak lengkap." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) return { message: "Pengguna tidak ditemukan." };
    if (user.code !== code) return { message: "Kode verifikasi salah." };
    if (user.codeExpires && new Date() > user.codeExpires) {
      return { message: "Kode verifikasi telah kedaluwarsa." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        code: null,
        codeExpires: null,
      },
    });

    redirect("/auth/signin?reset=success");
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    return { message: "Gagal mengatur ulang kata sandi." };
  }
}
