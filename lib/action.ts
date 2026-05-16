// "use server";

// import { SuratSchema } from "@/lib/zod";
// import { FormStateSurat } from "@/types/props";

// const SCRIPT_URL =
//   "https://script.google.com/macros/s/AKfycby3sss__lqSdj5_aq2NZvjzztHBnBnIWayPJibk8mBHTrknxeokrnP0-B3KCDoVoLQ/exec";

// const submitSuratOnlineInternal = async (
//   formData: FormData,
// ): Promise<FormStateSurat | "success"> => {
//   const rawData = {
//     jenisSurat: formData.get("jenisSurat"),
//     nik: formData.get("nik"),
//     nama: formData.get("nama"),
//     noHp: formData.get("noHp"),
//     rt: formData.get("rt"),
//     rw: formData.get("rw"),
//     keperluan: formData.get("keperluan"),
//   };

//   const validateFields = SuratSchema.safeParse(rawData);
//   if (!validateFields.success) {
//     return { error: validateFields.error.flatten().fieldErrors as any };
//   }

//   try {
//     const response = await fetch(SCRIPT_URL, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(validateFields.data),
//     });

//     if (!response.ok) {
//       throw new Error("Gagal mengirim data ke server.");
//     }

//     return "success";
//   } catch (err) {
//     console.error(err);
//     return { message: "Gagal memproses permohonan. Terjadi kesalahan server." };
//   }
// };

// export const submitSuratOnline = async (
//   prevState: FormStateSurat | null,
//   formData: FormData,
// ): Promise<FormStateSurat> => {
//   const result = await submitSuratOnlineInternal(formData);

//   if (result === "success") {
//     return { message: "Permohonan surat berhasil dikirim." };
//   }

//   return result;
// };

// import { prisma } from "@/lib/prisma";
// import { revalidateComplaint } from "@/lib/data";
// import { ComplaintSchema } from "@/lib/zod";

// export async function submitPengaduan(prevState: any, formData: FormData) {
//   const validatedFields = ComplaintSchema.safeParse({
//     name: formData.get("name"),
//     phone: formData.get("phone"),
//     category: formData.get("category"),
//     title: formData.get("title"),
//     content: formData.get("content"),
//     imageUrl: formData.get("imageUrl") || undefined,
//   });

//   if (!validatedFields.success) {
//     return {
//       success: false,
//       error: "Data tidak valid",
//       message: "Gagal mengirim pengaduan. Periksa kembali form Anda.",
//       fields: validatedFields.error.flatten().fieldErrors,
//     };
//   }

//   const { title, content, ...rest } = validatedFields.data;

//   try {
//     // Save to Database - combining title into content as schema doesn't have title field
//     await prisma.complaint.create({
//       data: {
//         ...rest,
//         content: `[${title}] ${content}`,
//       },
//     });

//     // Optional: Keep sending to Google Script if needed
//     try {
//       await fetch(SCRIPT_URL, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           ...validatedFields.data,
//           type: "PENGADUAN",
//         }),
//       });
//     } catch (err) {
//       console.warn("Failed to send to Google Script, but saved to DB:", err);
//     }

//     revalidateComplaint();
//     return { success: true, message: "Pengaduan berhasil dikirim." };
//   } catch (error) {
//     console.error("Server Action Error:", error);
//     return {
//       success: false,
//       error: "Gagal memproses pengaduan.",
//       message: "Terjadi kesalahan pada server.",
//     };
//   }
// }
